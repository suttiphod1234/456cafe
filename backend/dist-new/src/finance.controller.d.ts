import { FinanceService, CreateCashflowDto } from './finance.service';
export declare class FinanceController {
    private readonly financeService;
    constructor(financeService: FinanceService);
    createTransaction(data: CreateCashflowDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        branchId: string;
        note: string | null;
        type: string;
        referenceId: string | null;
        createdBy: string | null;
        amount: number;
    }>;
    getTransactions(branchId?: string, type?: string, startDate?: string, endDate?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        branchId: string;
        note: string | null;
        type: string;
        referenceId: string | null;
        createdBy: string | null;
        amount: number;
    }[]>;
    getSummary(branchId?: string, startDate?: string, endDate?: string): Promise<{
        totalIncome: number;
        totalExpense: number;
        netProfit: number;
    }>;
}
