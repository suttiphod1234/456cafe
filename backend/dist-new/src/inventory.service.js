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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
let InventoryService = class InventoryService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getBranchInventory(branchId) {
        return this.prisma.inventory.findMany({
            where: { branchId },
            include: {
                ingredient: true,
            },
        });
    }
    async deductInventoryForOrder(orderId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                recipes: true,
                            },
                        },
                    },
                },
            },
        });
        if (!order) {
            throw new common_1.BadRequestException('Order not found');
        }
        const branchId = order.branchId;
        const requiredIngredients = new Map();
        for (const item of order.items) {
            const quantity = item.quantity;
            for (const recipe of item.product.recipes) {
                const totalNeeded = recipe.quantity * quantity;
                const currentAmount = requiredIngredients.get(recipe.ingredientId) || 0;
                requiredIngredients.set(recipe.ingredientId, currentAmount + totalNeeded);
            }
        }
        return this.prisma.$transaction(async (tx) => {
            const lowStockAlerts = [];
            for (const [ingredientId, amountNeeded,] of requiredIngredients.entries()) {
                const inventoryItem = await tx.inventory.findUnique({
                    where: {
                        branchId_ingredientId: {
                            branchId,
                            ingredientId,
                        },
                    },
                    include: { ingredient: true },
                });
                if (!inventoryItem) {
                    throw new common_1.BadRequestException(`Missing inventory record for ingredient ID: ${ingredientId}`);
                }
                if (inventoryItem.quantity < amountNeeded) {
                    throw new common_1.BadRequestException(`Insufficient stock for ${inventoryItem.ingredient.name}. Needed: ${amountNeeded}, Available: ${inventoryItem.quantity}`);
                }
                const newQuantity = inventoryItem.quantity - amountNeeded;
                if (newQuantity <= inventoryItem.lowStockThreshold) {
                    lowStockAlerts.push({
                        ingredient: inventoryItem.ingredient.name,
                        remaining: newQuantity,
                        threshold: inventoryItem.lowStockThreshold,
                    });
                }
                await tx.inventory.update({
                    where: { id: inventoryItem.id },
                    data: { quantity: newQuantity },
                });
                await tx.inventoryTransaction.create({
                    data: {
                        branchId,
                        ingredientId,
                        type: 'ORDER_DEDUCTION',
                        quantity: -amountNeeded,
                        unitCost: inventoryItem.ingredient.costPerUnit || 0,
                        totalCost: amountNeeded * (inventoryItem.ingredient.costPerUnit || 0),
                        referenceId: orderId,
                        note: `Deducted for order ${order.orderNo}`,
                    },
                });
            }
            return {
                success: true,
                message: 'Inventory successfully deducted.',
                lowStockAlerts: lowStockAlerts.length > 0 ? lowStockAlerts : null,
            };
        });
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map