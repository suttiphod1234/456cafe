import { Injectable, NotFoundException } from '@nestjs/common';
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

  async createBranch(data: { name: string; location?: string }) {
    return this.prisma.branch.create({
      data: {
        name: data.name,
        location: data.location,
      },
      include: {
        _count: { select: { orders: true, inventory: true } }
      }
    });
  }

  async updateBranch(id: string, data: { name?: string; location?: string }) {
    const branch = await this.prisma.branch.findUnique({ where: { id } });
    if (!branch) throw new NotFoundException(`Branch ${id} not found`);

    return this.prisma.branch.update({
      where: { id },
      data: {
        name: data.name,
        location: data.location,
      },
      include: {
        _count: { select: { orders: true, inventory: true } }
      }
    });
  }

  async deleteBranch(id: string) {
    const branch = await this.prisma.branch.findUnique({ where: { id } });
    if (!branch) throw new NotFoundException(`Branch ${id} not found`);
    return this.prisma.branch.delete({ where: { id } });
  }
}
