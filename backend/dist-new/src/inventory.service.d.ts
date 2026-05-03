import { PrismaService } from './prisma.service';
export declare class InventoryService {
    private prisma;
    constructor(prisma: PrismaService);
    getBranchInventory(branchId: string): Promise<({
        ingredient: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            unit: string;
            costPerUnit: number;
            sku: string | null;
        };
    } & {
        id: string;
        updatedAt: Date;
        branchId: string;
        ingredientId: string;
        quantity: number;
        lowStockThreshold: number;
    })[]>;
    deductInventoryForOrder(orderId: string): Promise<{
        success: boolean;
        message: string;
        lowStockAlerts: any[] | null;
    }>;
}
