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
exports.InventoryTransactionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
let InventoryTransactionService = class InventoryTransactionService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createTransaction(data) {
        return this.prisma.$transaction(async (tx) => {
            const ingredient = await tx.ingredient.findUnique({
                where: { id: data.ingredientId },
            });
            if (!ingredient)
                throw new common_1.BadRequestException('Ingredient not found');
            let inventory = await tx.inventory.findUnique({
                where: {
                    branchId_ingredientId: {
                        branchId: data.branchId,
                        ingredientId: data.ingredientId,
                    },
                },
            });
            if (!inventory) {
                inventory = await tx.inventory.create({
                    data: {
                        branchId: data.branchId,
                        ingredientId: data.ingredientId,
                        quantity: 0,
                    },
                });
            }
            const isDeduction = ['STOCK_OUT', 'WASTE', 'ORDER_DEDUCTION'].includes(data.type);
            const absQuantity = Math.abs(data.quantity);
            const netQuantity = isDeduction ? -absQuantity : absQuantity;
            const newQuantity = inventory.quantity + netQuantity;
            if (newQuantity < 0) {
                throw new common_1.BadRequestException(`Insufficient stock for ${ingredient.name}`);
            }
            const unitCost = data.unitCost ?? ingredient.costPerUnit;
            const totalCost = absQuantity * unitCost;
            if (data.type === 'STOCK_IN' && inventory.quantity >= 0) {
                const currentTotalValue = inventory.quantity * ingredient.costPerUnit;
                const newTotalValue = currentTotalValue + totalCost;
                const newAverageCost = newTotalValue / newQuantity;
                await tx.ingredient.update({
                    where: { id: ingredient.id },
                    data: { costPerUnit: newAverageCost },
                });
            }
            await tx.inventory.update({
                where: { id: inventory.id },
                data: { quantity: newQuantity },
            });
            const inventoryTx = await tx.inventoryTransaction.create({
                data: {
                    branchId: data.branchId,
                    ingredientId: data.ingredientId,
                    type: data.type,
                    quantity: netQuantity,
                    unitCost,
                    totalCost,
                    referenceId: data.referenceId,
                    note: data.note,
                    createdBy: data.createdBy,
                },
            });
            if (data.type === 'STOCK_IN' && totalCost > 0) {
                await tx.cashflowTransaction.create({
                    data: {
                        branchId: data.branchId,
                        type: 'EXPENSE',
                        category: 'INGREDIENTS',
                        amount: totalCost,
                        referenceId: inventoryTx.id,
                        note: `ซื้อวัตถุดิบ: ${ingredient.name} (${absQuantity} ${ingredient.unit})`,
                        createdBy: data.createdBy,
                    }
                });
            }
            return inventoryTx;
        });
    }
    async getTransactions(filters) {
        const where = {};
        if (filters.branchId)
            where.branchId = filters.branchId;
        if (filters.ingredientId)
            where.ingredientId = filters.ingredientId;
        if (filters.type)
            where.type = filters.type;
        if (filters.startDate && filters.endDate) {
            where.createdAt = {
                gte: new Date(filters.startDate),
                lte: new Date(filters.endDate),
            };
        }
        return this.prisma.inventoryTransaction.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                ingredient: true,
            },
        });
    }
};
exports.InventoryTransactionService = InventoryTransactionService;
exports.InventoryTransactionService = InventoryTransactionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InventoryTransactionService);
//# sourceMappingURL=inventory-transaction.service.js.map