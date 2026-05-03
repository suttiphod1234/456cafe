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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
let AuthService = class AuthService {
    prisma;
    otpMap = new Map();
    constructor(prisma) {
        this.prisma = prisma;
    }
    sendOtp(phone) {
        const code = '123456';
        const expires = Date.now() + 5 * 60 * 1000;
        this.otpMap.set(phone, { code, expires });
        console.log(`[AUTH] Mock OTP for ${phone}: ${code}`);
        return { success: true, message: 'OTP sent successfully (Check console)' };
    }
    async verifyOtp(phone, inputCode, metadata) {
        const record = this.otpMap.get(phone);
        if (!record || record.expires < Date.now()) {
            throw new common_1.BadRequestException('OTP expired or not found');
        }
        if (record.code !== inputCode) {
            throw new common_1.BadRequestException('Invalid OTP code');
        }
        this.otpMap.delete(phone);
        let user = await this.prisma.user.findFirst({
            where: { phone },
        });
        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    phone,
                    name: metadata?.name || 'Customer',
                    authProviders: {
                        create: { provider: 'PHONE', providerId: phone },
                    },
                },
            });
        }
        return user;
    }
    async loginWithLine(lineUid, profile) {
        const provider = await this.prisma.authProvider.findUnique({
            where: { providerId: lineUid },
            include: { user: true },
        });
        if (provider)
            return provider.user;
        if (profile.email) {
            const existingUser = await this.prisma.user.findUnique({
                where: { email: profile.email },
            });
            if (existingUser) {
                await this.prisma.authProvider.create({
                    data: {
                        userId: existingUser.id,
                        provider: 'LINE',
                        providerId: lineUid,
                    },
                });
                return existingUser;
            }
        }
        return this.prisma.user.create({
            data: {
                name: profile.displayName,
                email: profile.email,
                authProviders: {
                    create: { provider: 'LINE', providerId: lineUid },
                },
            },
        });
    }
    async linkProvider(userId, provider, providerId) {
        const existing = await this.prisma.authProvider.findUnique({
            where: { providerId },
        });
        if (existing) {
            if (existing.userId === userId)
                return;
            throw new common_1.BadRequestException('This account is already linked to another user');
        }
        await this.prisma.authProvider.create({
            data: { userId, provider, providerId },
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map