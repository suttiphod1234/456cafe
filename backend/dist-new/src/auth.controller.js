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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const prisma_service_1 = require("./prisma.service");
let AuthController = class AuthController {
    authService;
    prisma;
    constructor(authService, prisma) {
        this.authService = authService;
        this.prisma = prisma;
    }
    sendOtp(body) {
        if (!body.phone)
            throw new common_1.BadRequestException('Phone is required');
        return this.authService.sendOtp(body.phone);
    }
    async verifyOtp(body) {
        if (!body.phone || !body.code)
            throw new common_1.BadRequestException('Phone and code are required');
        return this.authService.verifyOtp(body.phone, body.code, {
            name: body.name,
        });
    }
    async loginWithLine(body) {
        if (!body.lineUid)
            throw new common_1.BadRequestException('LINE UID is required');
        return this.authService.loginWithLine(body.lineUid, {
            displayName: body.displayName,
            pictureUrl: body.pictureUrl,
            email: body.email,
        });
    }
    async getMe(userId) {
        if (!userId)
            return null;
        return this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                authProviders: true,
                addresses: true,
                pointHistory: { orderBy: { createdAt: 'desc' }, take: 20 },
            },
        });
    }
    async linkAccount(body) {
        return this.authService.linkProvider(body.userId, body.provider, body.providerId);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('otp/send'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "sendOtp", null);
__decorate([
    (0, common_1.Post)('otp/verify'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.Post)('line'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginWithLine", null);
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getMe", null);
__decorate([
    (0, common_1.Post)('link'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "linkAccount", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('api/auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        prisma_service_1.PrismaService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map