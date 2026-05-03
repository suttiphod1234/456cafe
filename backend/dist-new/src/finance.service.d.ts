import { PrismaService } from './prisma.service';
export declare class CreateCashflowDto {
    branchId: string;
    type: string;
    category: string;
    amount: number;
    note?: string;
    referenceId?: string;
    createdBy?: string;
}
export declare class FinanceService {
    private prisma;
    constructor(prisma: PrismaService);
    createTransaction(data: CreateCashflowDto): Promise<{
        category: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        branchId: string;
        note: string | null;
        type: string;
        referenceId: string | null;
        createdBy: string | null;
        amount: number;
    }>;
    getTransactions(filters: {
        branchId?: string;
        type?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<{
        category: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        branchId: string;
        note: string | null;
        type: string;
        referenceId: string | null;
        createdBy: string | null;
        amount: number;
    }[]>;
    getSummary(filters: {
        branchId?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<{
        totalIncome: number;
        totalExpense: number;
        netProfit: number;
    }>;
}
