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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
let UserService = class UserService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllUsers(search) {
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search } },
                { email: { contains: search } },
                { phone: { contains: search } },
            ];
        }
        return this.prisma.user.findMany({
            where,
            include: {
                authProviders: true,
                _count: {
                    select: { orders: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getUserById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                authProviders: true,
                orders: {
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                    include: { branch: true },
                },
            },
        });
        if (!user)
            throw new common_1.NotFoundException(`User ${id} not found`);
        return user;
    }
    async updatePoints(id, delta, reason) {
        const user = await this.prisma.user.update({
            where: { id },
            data: {
                points: { increment: delta },
            },
        });
        await this.prisma.auditLog.create({
            data: {
                action: 'UPDATE_POINTS',
                entity: 'User',
                entityId: id,
                details: { delta, reason, newPoints: user.points },
            },
        });
        return user;
    }
    async setRole(id, role) {
        return this.prisma.user.update({
            where: { id },
            data: { role },
        });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
//# sourceMappingURL=user.service.js.map