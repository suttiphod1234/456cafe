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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
let ProductService = class ProductService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllProducts() {
        return this.prisma.product.findMany({
            include: {
                recipes: {
                    include: { ingredient: true },
                },
                _count: {
                    select: { orderItems: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getProductById(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                recipes: {
                    include: { ingredient: true },
                },
                _count: { select: { orderItems: true } },
            },
        });
        if (!product)
            throw new common_1.NotFoundException(`Product ${id} not found`);
        return product;
    }
    async createProduct(data) {
        return this.prisma.product.create({
            data: {
                name: data.name,
                description: data.description,
                price: data.price,
                categoryId: data.categoryId,
                imageUrl: data.imageUrl,
            },
            include: {
                recipes: { include: { ingredient: true } },
                _count: { select: { orderItems: true } },
            },
        });
    }
    async updateProduct(id, data) {
        await this.getProductById(id);
        return this.prisma.product.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                price: data.price,
                categoryId: data.categoryId,
                imageUrl: data.imageUrl,
            },
            include: {
                recipes: { include: { ingredient: true } },
                _count: { select: { orderItems: true } },
            },
        });
    }
    async deleteProduct(id) {
        await this.getProductById(id);
        await this.prisma.recipe.deleteMany({ where: { productId: id } });
        return this.prisma.product.delete({ where: { id } });
    }
    async getAllIngredients() {
        return this.prisma.ingredient.findMany({ orderBy: { name: 'asc' } });
    }
    async addRecipe(productId, ingredientId, quantity) {
        await this.getProductById(productId);
        return this.prisma.recipe.create({
            data: { productId, ingredientId, quantity },
            include: { ingredient: true },
        });
    }
    async updateRecipe(recipeId, quantity) {
        return this.prisma.recipe.update({
            where: { id: recipeId },
            data: { quantity },
            include: { ingredient: true },
        });
    }
    async deleteRecipe(recipeId) {
        return this.prisma.recipe.delete({ where: { id: recipeId } });
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductService);
//# sourceMappingURL=product.service.js.map