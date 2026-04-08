import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class BranchService {
  constructor(private prisma: PrismaService) {}

  async getAllBranches() {
    return this.prisma.branch.findMany({
      include: {
        _count: {
          select: { orders: true, inventory: true }
        }
      }
    });
  }

  async getProducts() {
    return this.prisma.product.findMany({
      include: {
        recipes: {
          include: { ingredient: true }
        }
      }
    });
  }

  async getBranchStats(branchId: string) {
    const totalOrders = await this.prisma.order.count({
      where: { branchId }
    });

    const revenueRaw = await this.prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { branchId, status: { in: ['PICKED_UP', 'READY'] } }
    });

    return {
      totalOrders,
      revenue: revenueRaw._sum.totalAmount || 0,
    };
  }
}
