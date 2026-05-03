import { PrismaService } from './prisma.service';
export interface CreateTransactionDto {
    branchId: string;
    ingredientId: string;
    type: string;
    quantity: number;
    unitCost?: number;
    referenceId?: string;
    note?: string;
    createdBy?: string;
}
export declare class InventoryTransactionService {
    private prisma;
    constructor(prisma: PrismaService);
    createTransaction(data: CreateTransactionDto): Promise<{
        id: string;
        createdAt: Date;
        branchId: string;
        ingredientId: string;
        quantity: number;
        note: string | null;
        type: string;
        unitCost: number;
        totalCost: number;
        referenceId: string | null;
        createdBy: string | null;
    }>;
    getTransactions(filters: {
        branchId?: string;
        ingredientId?: string;
        type?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<({
        ingredient: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            unit: string;
            costPerUnit: number;
            sku: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        branchId: string;
        ingredientId: string;
        quantity: number;
        note: string | null;
        type: string;
        unitCost: number;
        totalCost: number;
        referenceId: string | null;
        createdBy: string | null;
    })[]>;
}
