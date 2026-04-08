import { Injectable, BadRequestException } from '@nestjs/common';
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

  async createOrder(data: any) {
    const { branchId, customerUid, items, totalAmount } = data;

    // 1. Create Order in DB
    const order = await this.prisma.order.create({
      data: {
        branchId,
        customerUid,
        totalAmount,
        status: 'PENDING',
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            customization: item.customization,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
      },
    });

    // 2. Notify Branch Real-time
    this.gateway.notifyNewOrder(branchId, order);

    // 3. Create Audit Log
    await this.prisma.auditLog.create({
      data: {
        action: 'CREATE_ORDER',
        entity: 'Order',
        entityId: order.id,
        details: { customerUid, totalAmount },
      },
    });

    return order;
  }

  async updateOrderStatus(orderId: string, status: any) {
    // 1. Update status
    const order = await this.prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { items: true },
    });

    // 2. If status is READY, cut stock automatically
    if (status === 'READY') {
      try {
        const result = await this.inventory.deductInventoryForOrder(orderId);
        if (result.lowStockAlerts) {
          this.gateway.notifyInventoryAlert(order.branchId, result.lowStockAlerts);
        }
      } catch (e: any) {
        console.error(`Failed to deduct inventory for order ${orderId}:`, e.message);
        // Notify the branch about the failure specifically
        this.gateway.server.to(`branch-${order.branchId}`).emit('inventory-error', {
          orderId,
          message: e.message
        });
      }
    }

    // 3. Notify clients
    this.gateway.notifyUpdateOrder(order.branchId, order);
    
    return order;
  }

  async getRecentOrders() {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        branch: true
      }
    });
  }

  async getGlobalStats() {
    const totalOrders = await this.prisma.order.count();
    const aggregate = await this.prisma.order.aggregate({
      _sum: { totalAmount: true },
    });
    const customerCount = await this.prisma.order.groupBy({
      by: ['customerUid'],
    });
    const branches = await this.prisma.branch.count();

    return {
      revenue: aggregate._sum.totalAmount || 0,
      totalOrders,
      customers: customerCount.length,
      branches
    };
  }

  async getAiRecommendation(userInput: string) {
    const products = await this.prisma.product.findMany({ take: 5 });
    return this.ai.recommendCoffee(userInput, products);
  }

  async getAiTranslate(text: string, targetLanguage: 'Thai' | 'English') {
    return this.ai.translate(text, targetLanguage);
  }
}
