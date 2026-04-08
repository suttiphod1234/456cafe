import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { OrderGateway } from './order.gateway';
import { AiService } from './ai.service';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private gateway: OrderGateway,
    private ai: AiService,
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
        items: true,
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
    const order = await this.prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { items: true },
    });

    this.gateway.notifyUpdateOrder(order.branchId, order);
    
    return order;
  }

  async getAiRecommendation(userInput: string) {
    const products = await this.prisma.product.findMany({ take: 5 });
    return this.ai.recommendCoffee(userInput, products);
  }
}
