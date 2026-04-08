import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  // Get current inventory for a specific branch
  async getBranchInventory(branchId: string) {
    return this.prisma.inventory.findMany({
      where: { branchId },
      include: {
        ingredient: true,
      },
    });
  }

  // Deduct inventory when an order moves to "READY"
  async deductInventoryForOrder(orderId: string) {
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
      throw new BadRequestException('Order not found');
    }

    const branchId = order.branchId;

    // Calculate total ingredients required for this entire order
    const requiredIngredients = new Map<string, number>();

    for (const item of order.items) {
      const quantity = item.quantity;
      for (const recipe of item.product.recipes) {
        const totalNeeded = recipe.quantity * quantity;
        const currentAmount = requiredIngredients.get(recipe.ingredientId) || 0;
        requiredIngredients.set(recipe.ingredientId, currentAmount + totalNeeded);
      }
    }

    // Process deductive logic inside a transaction to ensure stock consistency
    return this.prisma.$transaction(async (tx) => {
      const lowStockAlerts: any[] = [];

      for (const [ingredientId, amountNeeded] of requiredIngredients.entries()) {
        const inventoryItem = await tx.inventory.findUnique({
          where: {
            branchId_ingredientId: {
              branchId,
              ingredientId,
            },
          },
          include: { ingredient: true }
        });

        if (!inventoryItem) {
          throw new BadRequestException(`Missing inventory record for ingredient ID: ${ingredientId}`);
        }

        if (inventoryItem.quantity < amountNeeded) {
          throw new BadRequestException(`Insufficient stock for ${inventoryItem.ingredient.name}. Needed: ${amountNeeded}, Available: ${inventoryItem.quantity}`);
        }

        const newQuantity = inventoryItem.quantity - amountNeeded;

        // Check for low stock threshold
        if (newQuantity <= inventoryItem.lowStockThreshold) {
          lowStockAlerts.push({
            ingredient: inventoryItem.ingredient.name,
            remaining: newQuantity,
            threshold: inventoryItem.lowStockThreshold
          });
        }

        // Deduct
        await tx.inventory.update({
          where: { id: inventoryItem.id },
          data: { quantity: newQuantity },
        });
      }

      return {
        success: true,
        message: 'Inventory successfully deducted.',
        lowStockAlerts: lowStockAlerts.length > 0 ? lowStockAlerts : null,
      };
    });
  }
}
