import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';

export interface BranchDetailDto {
  name?: string;
  location?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  isOpen?: boolean;
  openTime?: string;
  closeTime?: string;
}

export interface CreateManagerDto {
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  lineUid?: string;
}

@Injectable()
export class BranchService {
  constructor(private prisma: PrismaService) {}

  // ─── Branch CRUD ───────────────────────────────────────────────────────────

  async getAllBranches() {
    return this.prisma.branch.findMany({
      include: {
        _count: { select: { orders: true, inventory: true } },
        managers: { orderBy: { createdAt: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBranchById(id: string) {
    const branch = await this.prisma.branch.findUnique({
      where: { id },
      include: {
        managers: { orderBy: { createdAt: 'asc' } },
        _count: { select: { orders: true, inventory: true } },
      },
    });
    if (!branch) throw new NotFoundException(`Branch ${id} not found`);
    return branch;
  }

  async createBranch(data: BranchDetailDto & { name: string }) {
    return this.prisma.branch.create({
      data: {
        name: data.name,
        location: data.location,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        isOpen: data.isOpen ?? true,
        openTime: data.openTime,
        closeTime: data.closeTime,
      },
      include: {
        managers: true,
        _count: { select: { orders: true, inventory: true } },
      },
    });
  }

  async updateBranch(id: string, data: BranchDetailDto) {
    await this.getBranchById(id);
    return this.prisma.branch.update({
      where: { id },
      data: {
        name: data.name,
        location: data.location,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        isOpen: data.isOpen,
        openTime: data.openTime,
        closeTime: data.closeTime,
      },
      include: {
        managers: true,
        _count: { select: { orders: true, inventory: true } },
      },
    });
  }

  async toggleBranchOpen(id: string) {
    const branch = await this.getBranchById(id);
    return this.prisma.branch.update({
      where: { id },
      data: { isOpen: !branch.isOpen },
      include: {
        managers: true,
        _count: { select: { orders: true, inventory: true } },
      },
    });
  }

  async deleteBranch(id: string) {
    await this.getBranchById(id);
    // Delete related managers first
    await this.prisma.branchManager.deleteMany({ where: { branchId: id } });
    return this.prisma.branch.delete({ where: { id } });
  }

  // ─── Manager CRUD ──────────────────────────────────────────────────────────

  async getManagers(branchId: string) {
    await this.getBranchById(branchId);
    return this.prisma.branchManager.findMany({
      where: { branchId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async addManager(branchId: string, data: CreateManagerDto) {
    await this.getBranchById(branchId);
    return this.prisma.branchManager.create({
      data: {
        branchId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role ?? 'BRANCH_MANAGER',
        lineUid: data.lineUid,
      },
    });
  }

  async updateManager(managerId: string, data: Partial<CreateManagerDto>) {
    const mgr = await this.prisma.branchManager.findUnique({
      where: { id: managerId },
    });
    if (!mgr) throw new NotFoundException(`Manager ${managerId} not found`);
    return this.prisma.branchManager.update({
      where: { id: managerId },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        lineUid: data.lineUid,
      },
    });
  }

  async deleteManager(managerId: string) {
    const mgr = await this.prisma.branchManager.findUnique({
      where: { id: managerId },
    });
    if (!mgr) throw new NotFoundException(`Manager ${managerId} not found`);
    return this.prisma.branchManager.delete({ where: { id: managerId } });
  }

  // ─── Branch Dashboard ──────────────────────────────────────────────────────

  async getBranchDashboard(branchId: string) {
    await this.getBranchById(branchId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalOrders,
      todayOrders,
      revenueRaw,
      todayRevenueRaw,
      recentOrders,
      topProducts,
    ] = await Promise.all([
      this.prisma.order.count({ where: { branchId } }),
      this.prisma.order.count({
        where: {
          branchId,
          createdAt: { gte: today, lt: tomorrow },
        },
      }),
      this.prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { branchId, status: { in: ['PICKED_UP', 'READY'] } },
      }),
      this.prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: {
          branchId,
          status: { in: ['PICKED_UP', 'READY'] },
          createdAt: { gte: today, lt: tomorrow },
        },
      }),
      this.prisma.order.findMany({
        where: { branchId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { items: { include: { product: true } } },
      }),
      this.prisma.orderItem.groupBy({
        by: ['productId'],
        where: { order: { branchId } },
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5,
      }),
    ]);

    // Get product names for top products
    const productIds = topProducts.map((p) => p.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const topProductsWithNames = topProducts.map((tp) => ({
      productId: tp.productId,
      name: products.find((p) => p.id === tp.productId)?.name || 'Unknown',
      totalSold: tp._sum.quantity || 0,
    }));

    return {
      totalOrders,
      todayOrders,
      totalRevenue: revenueRaw._sum.totalAmount || 0,
      todayRevenue: todayRevenueRaw._sum.totalAmount || 0,
      recentOrders,
      topProducts: topProductsWithNames,
    };
  }

  // ─── Branch Orders ─────────────────────────────────────────────────────────

  async getBranchOrders(branchId: string, limit = 20) {
    return this.prisma.order.findMany({
      where: { branchId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        items: { include: { product: true } },
      },
    });
  }

  // ─── Legacy: Products (used by other parts) ────────────────────────────────

  async getProducts() {
    return this.prisma.product.findMany({
      include: { recipes: { include: { ingredient: true } } },
    });
  }

  async getBranchStats(branchId: string) {
    const totalOrders = await this.prisma.order.count({ where: { branchId } });
    const revenueRaw = await this.prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { branchId, status: { in: ['PICKED_UP', 'READY'] } },
    });
    return {
      totalOrders,
      revenue: revenueRaw._sum.totalAmount || 0,
    };
  }
}
