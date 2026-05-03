"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
let BranchService = class BranchService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllBranches() {
        return this.prisma.branch.findMany({
            include: {
                _count: { select: { orders: true, inventory: true } },
                managers: { orderBy: { createdAt: 'asc' } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getBranchById(id) {
        const branch = await this.prisma.branch.findUnique({
            where: { id },
            include: {
                managers: { orderBy: { createdAt: 'asc' } },
                _count: { select: { orders: true, inventory: true } },
            },
        });
        if (!branch)
            throw new common_1.NotFoundException(`Branch ${id} not found`);
        return branch;
    }
    async createBranch(data) {
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
                phone: data.phone,
                promptpayId: data.promptpayId,
                promptpayName: data.promptpayName,
                imageUrl: data.imageUrl,
            },
            include: {
                managers: true,
                _count: { select: { orders: true, inventory: true } },
            },
        });
    }
    async updateBranch(id, data) {
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
                phone: data.phone,
                promptpayId: data.promptpayId,
                promptpayName: data.promptpayName,
                imageUrl: data.imageUrl,
            },
            include: {
                managers: true,
                _count: { select: { orders: true, inventory: true } },
            },
        });
    }
    async toggleBranchOpen(id) {
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
    async deleteBranch(id) {
        await this.getBranchById(id);
        await this.prisma.branchManager.deleteMany({ where: { branchId: id } });
        return this.prisma.branch.delete({ where: { id } });
    }
    async getManagers(branchId) {
        await this.getBranchById(branchId);
        return this.prisma.branchManager.findMany({
            where: { branchId },
            orderBy: { createdAt: 'asc' },
        });
    }
    async addManager(branchId, data) {
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
    async updateManager(managerId, data) {
        const mgr = await this.prisma.branchManager.findUnique({
            where: { id: managerId },
        });
        if (!mgr)
            throw new common_1.NotFoundException(`Manager ${managerId} not found`);
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
    async deleteManager(managerId) {
        const mgr = await this.prisma.branchManager.findUnique({
            where: { id: managerId },
        });
        if (!mgr)
            throw new common_1.NotFoundException(`Manager ${managerId} not found`);
        return this.prisma.branchManager.delete({ where: { id: managerId } });
    }
    async getBranchDashboard(branchId) {
        await this.getBranchById(branchId);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const [totalOrders, todayOrders, revenueRaw, todayRevenueRaw, recentOrders, topProducts,] = await Promise.all([
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
    async getBranchOrders(branchId, limit = 20) {
        return this.prisma.order.findMany({
            where: { branchId },
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: {
                items: { include: { product: true } },
            },
        });
    }
    async getProducts() {
        return this.prisma.product.findMany({
            include: { recipes: { include: { ingredient: true } } },
        });
    }
    async getBranchStats(branchId) {
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
};
exports.BranchService = BranchService;
exports.BranchService = BranchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BranchService);
//# sourceMappingURL=branch.service.js.map