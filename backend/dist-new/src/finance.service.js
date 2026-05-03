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
exports.FinanceService = exports.CreateCashflowDto = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
class CreateCashflowDto {
    branchId;
    type;
    category;
    amount;
    note;
    referenceId;
    createdBy;
}
exports.CreateCashflowDto = CreateCashflowDto;
let FinanceService = class FinanceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createTransaction(data) {
        if (data.amount <= 0) {
            throw new common_1.BadRequestException('Amount must be greater than 0');
        }
        return this.prisma.cashflowTransaction.create({
            data: {
                branchId: data.branchId,
                type: data.type,
                category: data.category,
                amount: data.amount,
                note: data.note,
                referenceId: data.referenceId,
                createdBy: data.createdBy,
            }
        });
    }
    async getTransactions(filters) {
        const where = {};
        if (filters.branchId)
            where.branchId = filters.branchId;
        if (filters.type)
            where.type = filters.type;
        if (filters.startDate && filters.endDate) {
            where.createdAt = {
                gte: new Date(filters.startDate),
                lte: new Date(filters.endDate),
            };
        }
        return this.prisma.cashflowTransaction.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });
    }
    async getSummary(filters) {
        const where = {};
        if (filters.branchId)
            where.branchId = filters.branchId;
        if (filters.startDate && filters.endDate) {
            where.createdAt = {
                gte: new Date(filters.startDate),
                lte: new Date(filters.endDate),
            };
        }
        const transactions = await this.prisma.cashflowTransaction.findMany({ where });
        let totalIncome = 0;
        let totalExpense = 0;
        transactions.forEach(tx => {
            if (tx.type === 'INCOME')
                totalIncome += tx.amount;
            else if (tx.type === 'EXPENSE')
                totalExpense += tx.amount;
        });
        return {
            totalIncome,
            totalExpense,
            netProfit: totalIncome - totalExpense
        };
    }
};
exports.FinanceService = FinanceService;
exports.FinanceService = FinanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FinanceService);
//# sourceMappingURL=finance.service.js.map