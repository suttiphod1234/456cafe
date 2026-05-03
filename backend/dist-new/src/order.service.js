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
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
const order_gateway_1 = require("./order.gateway");
const ai_service_1 = require("./ai.service");
const inventory_service_1 = require("./inventory.service");
let OrderService = class OrderService {
    prisma;
    gateway;
    ai;
    inventory;
    constructor(prisma, gateway, ai, inventory) {
        this.prisma = prisma;
        this.gateway = gateway;
        this.ai = ai;
        this.inventory = inventory;
    }
    orderInclude = {
        items: { include: { product: true } },
        branch: true,
        payment: true,
    };
    async generateOrderNo() {
        const today = new Date();
        const prefix = `ORD-${today.getFullYear().toString().slice(-2)}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`;
        const count = await this.prisma.order.count({
            where: {
                createdAt: {
                    gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
                },
            },
        });
        return `${prefix}-${(count + 1).toString().padStart(4, '0')}`;
    }
    async createOrder(data) {
        const { branchId, userId, customerUid, customerName, items, totalAmount, fulfillmentType, note, scheduledAt, paymentMethod, } = data;
        try {
            const orderNo = await this.generateOrderNo();
            const today = new Date();
            const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const dailyCount = await this.prisma.order.count({
                where: { branchId, createdAt: { gte: startOfDay } },
            });
            const queueNo = dailyCount + 1;
            const order = await this.prisma.order.create({
                data: {
                    orderNo,
                    branchId,
                    userId: userId || null,
                    customerUid: customerUid || 'walk-in',
                    customerName: customerName || null,
                    totalAmount,
                    fulfillmentType: fulfillmentType || 'PICKUP',
                    platform: data.platform || 'STORE',
                    note: note || null,
                    scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
                    queueNo,
                    status: data.platform === 'STORE' ? 'PAID' : 'PENDING',
                    items: {
                        create: items.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            unitPrice: item.unitPrice || item.price,
                            optionsPrice: item.optionsPrice || 0,
                            price: item.price * item.quantity,
                            productName: item.productName || item.name || null,
                            customization: item.customization ?? null,
                            selectedOptions: item.selectedOptions ?? null,
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
            this.gateway.notifyNewOrder(branchId, order);
            await this.prisma.auditLog.create({
                data: {
                    action: 'CREATE_ORDER',
                    entity: 'Order',
                    entityId: order.id,
                    details: { customerUid, totalAmount, orderNo },
                },
            });
            return order;
        }
        catch (error) {
            console.error('Order creation error:', error);
            throw new common_1.BadRequestException('Could not create order.');
        }
    }
    async updateOrderStatus(orderId, status, metadata) {
        const data = {
            status: status,
        };
        if (metadata?.riderName)
            data.riderName = metadata.riderName;
        if (metadata?.riderPhone)
            data.riderPhone = metadata.riderPhone;
        if (metadata?.qcNote)
            data.qcNote = metadata.qcNote;
        const order = await this.prisma.order.update({
            where: { id: orderId },
            data,
            include: this.orderInclude,
        });
        if (status === 'READY_FOR_QC' ||
            status === 'READY' ||
            status === 'READY_FOR_PICKUP') {
            try {
                const result = await this.inventory.deductInventoryForOrder(orderId);
                if (result.lowStockAlerts) {
                    this.gateway.notifyInventoryAlert(order.branchId, result.lowStockAlerts);
                }
            }
            catch (e) {
                const msg = e instanceof Error ? e.message : 'Unknown error';
                console.error(`Inventory deduction failed for ${orderId}:`, msg);
                this.gateway.server
                    .to(`branch-${order.branchId}`)
                    .emit('inventory-error', { orderId, message: msg });
            }
        }
        this.gateway.notifyUpdateOrder(order.branchId, order);
        return order;
    }
    async updatePaymentStatus(orderId, data) {
        const payment = await this.prisma.payment.update({
            where: { orderId },
            data: {
                status: data.status,
                method: data.method,
                transactionId: data.transactionId,
                paidAt: data.status === 'PAID' ? new Date() : undefined,
            },
        });
        if (data.status === 'PAID') {
            const order = await this.prisma.order.update({
                where: { id: orderId },
                data: { status: 'PAID' },
            });
            if (order.userId) {
                const pointsEarned = Math.floor(order.totalAmount / 10);
                if (pointsEarned > 0) {
                    await this.prisma.user.update({
                        where: { id: order.userId },
                        data: { points: { increment: pointsEarned } },
                    });
                    await this.prisma.pointTransaction.create({
                        data: {
                            userId: order.userId,
                            orderId,
                            delta: pointsEarned,
                            reason: `ได้แต้มจากออเดอร์ #${order.orderNo}`,
                        },
                    });
                }
            }
            await this.prisma.cashflowTransaction.create({
                data: {
                    branchId: order.branchId,
                    type: 'INCOME',
                    category: 'SALES',
                    amount: order.totalAmount,
                    referenceId: order.id,
                    note: `รายได้จากออเดอร์ #${order.orderNo}`,
                }
            });
        }
        return payment;
    }
    async getAllOrders(filters) {
        const where = {};
        if (filters?.branchId)
            where.branchId = filters.branchId;
        if (filters?.status)
            where.status = filters.status;
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
    async getOrderById(id) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: this.orderInclude,
        });
        if (!order)
            throw new common_1.NotFoundException(`Order ${id} not found`);
        return order;
    }
    async getRecentOrders(limit = 10) {
        return this.prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: this.orderInclude,
        });
    }
    async getCustomerOrders(customerUid) {
        return this.prisma.order.findMany({
            where: { customerUid },
            orderBy: { createdAt: 'desc' },
            take: 50,
            include: this.orderInclude,
        });
    }
    async getOrderStats(branchId) {
        const where = branchId ? { branchId } : {};
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const [total, todayCount, todayRevenue, byStatus, totalRevenue] = await Promise.all([
            this.prisma.order.count({ where }),
            this.prisma.order.count({
                where: { ...where, createdAt: { gte: startOfDay } },
            }),
            this.prisma.order.aggregate({
                where: { ...where, createdAt: { gte: startOfDay } },
                _sum: { totalAmount: true },
            }),
            this.prisma.order.groupBy({ by: ['status'], where, _count: true }),
            this.prisma.order.aggregate({ where, _sum: { totalAmount: true } }),
        ]);
        return {
            total,
            todayCount,
            todayRevenue: todayRevenue._sum.totalAmount || 0,
            totalRevenue: totalRevenue._sum.totalAmount || 0,
            byStatus: Object.fromEntries(byStatus.map((s) => [s.status, s._count])),
        };
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
            branches,
        };
    }
    async cancelOrder(orderId, reason) {
        const order = await this.getOrderById(orderId);
        if (['COMPLETED', 'PICKED_UP', 'CANCELLED'].includes(order.status)) {
            throw new common_1.BadRequestException('Cannot cancel this order.');
        }
        const updated = await this.prisma.order.update({
            where: { id: orderId },
            data: { status: 'CANCELLED' },
            include: this.orderInclude,
        });
        if (order.payment?.status === 'PAID') {
            await this.prisma.payment.update({
                where: { orderId },
                data: { status: 'REFUNDED' },
            });
        }
        this.gateway.notifyUpdateOrder(updated.branchId, updated);
        await this.prisma.auditLog.create({
            data: {
                action: 'CANCEL_ORDER',
                entity: 'Order',
                entityId: orderId,
                details: { reason },
            },
        });
        return updated;
    }
    async getAiRecommendation(userInput) {
        const products = await this.prisma.product.findMany({ take: 5 });
        return this.ai.recommendCoffee(userInput, products);
    }
    async getAiTranslate(text, targetLanguage) {
        return this.ai.translate(text, targetLanguage);
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        order_gateway_1.OrderGateway,
        ai_service_1.AiService,
        inventory_service_1.InventoryService])
], OrderService);
//# sourceMappingURL=order.service.js.map