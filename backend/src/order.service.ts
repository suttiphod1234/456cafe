import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { OrderGateway } from './order.gateway';
import { AiService } from './ai.service';
import { InventoryService } from './inventory.service';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private gateway: OrderGateway,
    private ai: AiService,
    private inventory: InventoryService,
  ) {}

  // ─── Order Include ──────────────────────────────────────────────────────
  private orderInclude = {
    items: { include: { product: true } },
    branch: true,
    payment: true,
  };

  // ─── Generate Order No ──────────────────────────────────────────────────
  private async generateOrderNo(): Promise<string> {
    const today = new Date();
    const prefix = `ORD-${today.getFullYear().toString().slice(-2)}${(today.getMonth()+1).toString().padStart(2,'0')}${today.getDate().toString().padStart(2,'0')}`;
    const count = await this.prisma.order.count({
      where: { createdAt: { gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()) } },
    });
    return `${prefix}-${(count + 1).toString().padStart(4, '0')}`;
  }

  // ─── Create Order ───────────────────────────────────────────────────────
  async createOrder(data: any) {
    const { branchId, customerUid, customerName, items, totalAmount, fulfillmentType, note, scheduledAt, paymentMethod } = data;

    try {
      const orderNo = await this.generateOrderNo();

      const order = await this.prisma.order.create({
        data: {
          orderNo,
          branchId,
          customerUid: customerUid || 'walk-in',
          customerName: customerName || null,
          totalAmount,
          status: 'PENDING',
          fulfillmentType: fulfillmentType || 'PICKUP',
          note: note || null,
          scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice || item.price,
              optionsPrice: item.optionsPrice || 0,
              price: item.price * item.quantity,
              productName: item.productName || item.name || null,
              customization: item.customization || null,
              selectedOptions: item.selectedOptions || null,
            })),
          },
          payment: {
            create: {
              amount: totalAmount,
              status: 'UNPAID',
              method: paymentMethod || 'CASH',
            },
          },
        },
        include: this.orderInclude,
      });

      // Notify Branch Real-time
      this.gateway.notifyNewOrder(branchId, order);

      // Audit Log
      await this.prisma.auditLog.create({
        data: { action: 'CREATE_ORDER', entity: 'Order', entityId: order.id, details: { customerUid, totalAmount, orderNo } },
      });

      return order;
    } catch (error) {
      console.error('Order creation error:', error);
      throw new BadRequestException('Could not create order.');
    }
  }

  // ─── Update Order Status ────────────────────────────────────────────────
  async updateOrderStatus(orderId: string, status: string) {
    const order = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: status as any },
      include: this.orderInclude,
    });

    // If READY, cut stock
    if (status === 'READY') {
      try {
        const result = await this.inventory.deductInventoryForOrder(orderId);
        if (result.lowStockAlerts) {
          this.gateway.notifyInventoryAlert(order.branchId, result.lowStockAlerts);
        }
      } catch (e: any) {
        console.error(`Inventory deduction failed for ${orderId}:`, e.message);
        this.gateway.server.to(`branch-${order.branchId}`).emit('inventory-error', { orderId, message: e.message });
      }
    }

    // Notify clients
    this.gateway.notifyUpdateOrder(order.branchId, order);
    return order;
  }

  // ─── Update Payment Status ──────────────────────────────────────────────
  async updatePaymentStatus(orderId: string, data: { status: string; method?: string; transactionId?: string }) {
    const payment = await this.prisma.payment.update({
      where: { orderId },
      data: {
        status: data.status as any,
        method: data.method,
        transactionId: data.transactionId,
        paidAt: data.status === 'PAID' ? new Date() : undefined,
      },
    });

    // Auto-advance order status to PAID
    if (data.status === 'PAID') {
      await this.prisma.order.update({
        where: { id: orderId },
        data: { status: 'PAID' },
      });
    }

    return payment;
  }

  // ─── Get All Orders (with filters) ──────────────────────────────────────
  async getAllOrders(filters?: { branchId?: string; status?: string; date?: string; search?: string }) {
    const where: any = {};
    if (filters?.branchId) where.branchId = filters.branchId;
    if (filters?.status) where.status = filters.status;
    if (filters?.date) {
      const d = new Date(filters.date);
      where.createdAt = { gte: d, lt: new Date(d.getTime() + 86400000) };
    }
    if (filters?.search) {
      where.OR = [
        { orderNo: { contains: filters.search } },
        { customerName: { contains: filters.search } },
        { customerUid: { contains: filters.search } },
      ];
    }

    return this.prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: this.orderInclude,
    });
  }

  // ─── Get Order by ID ────────────────────────────────────────────────────
  async getOrderById(id: string) {
    const order = await this.prisma.order.findUnique({ where: { id }, include: this.orderInclude });
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    return order;
  }

  // ─── Recent Orders ─────────────────────────────────────────────────────
  async getRecentOrders(limit = 10) {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: this.orderInclude,
    });
  }

  // ─── Customer Order History ─────────────────────────────────────────────
  async getCustomerOrders(customerUid: string) {
    return this.prisma.order.findMany({
      where: { customerUid },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: this.orderInclude,
    });
  }

  // ─── Order Stats ────────────────────────────────────────────────────────
  async getOrderStats(branchId?: string) {
    const where = branchId ? { branchId } : {};
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const [total, todayCount, todayRevenue, byStatus, totalRevenue] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.count({ where: { ...where, createdAt: { gte: startOfDay } } }),
      this.prisma.order.aggregate({ where: { ...where, createdAt: { gte: startOfDay } }, _sum: { totalAmount: true } }),
      this.prisma.order.groupBy({ by: ['status'], where, _count: true }),
      this.prisma.order.aggregate({ where, _sum: { totalAmount: true } }),
    ]);

    return {
      total,
      todayCount,
      todayRevenue: todayRevenue._sum.totalAmount || 0,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      byStatus: Object.fromEntries(byStatus.map(s => [s.status, s._count])),
    };
  }

  // ─── Global Stats ──────────────────────────────────────────────────────
  async getGlobalStats() {
    const totalOrders = await this.prisma.order.count();
    const aggregate = await this.prisma.order.aggregate({ _sum: { totalAmount: true } });
    const customerCount = await this.prisma.order.groupBy({ by: ['customerUid'] });
    const branches = await this.prisma.branch.count();
    return { revenue: aggregate._sum.totalAmount || 0, totalOrders, customers: customerCount.length, branches };
  }

  // ─── Cancel Order ───────────────────────────────────────────────────────
  async cancelOrder(orderId: string, reason?: string) {
    const order = await this.getOrderById(orderId);
    if (['COMPLETED', 'PICKED_UP', 'CANCELLED'].includes(order.status)) {
      throw new BadRequestException('Cannot cancel this order.');
    }

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
      include: this.orderInclude,
    });

    // Refund if paid
    if (order.payment?.status === 'PAID') {
      await this.prisma.payment.update({ where: { orderId }, data: { status: 'REFUNDED' } });
    }

    this.gateway.notifyUpdateOrder(updated.branchId, updated);
    await this.prisma.auditLog.create({
      data: { action: 'CANCEL_ORDER', entity: 'Order', entityId: orderId, details: { reason } },
    });

    return updated;
  }

  // ─── AI ─────────────────────────────────────────────────────────────────
  async getAiRecommendation(userInput: string) {
    const products = await this.prisma.product.findMany({ take: 5 });
    return this.ai.recommendCoffee(userInput, products);
  }

  async getAiTranslate(text: string, targetLanguage: 'Thai' | 'English') {
    return this.ai.translate(text, targetLanguage);
  }
}
