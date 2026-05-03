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
exports.MenuService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
let MenuService = class MenuService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllCategories() {
        return this.prisma.category.findMany({
            orderBy: { sortOrder: 'asc' },
            include: { _count: { select: { products: true } } },
        });
    }
    async createCategory(data) {
        const maxOrder = await this.prisma.category.aggregate({
            _max: { sortOrder: true },
        });
        return this.prisma.category.create({
            data: {
                ...data,
                sortOrder: data.sortOrder ?? (maxOrder._max.sortOrder ?? 0) + 1,
                isVisible: data.isVisible ?? true,
            },
            include: { _count: { select: { products: true } } },
        });
    }
    async updateCategory(id, data) {
        return this.prisma.category.update({
            where: { id },
            data,
            include: { _count: { select: { products: true } } },
        });
    }
    async deleteCategory(id) {
        await this.prisma.product.updateMany({
            where: { categoryId: id },
            data: { categoryId: null },
        });
        return this.prisma.category.delete({ where: { id } });
    }
    async reorderCategories(items) {
        await Promise.all(items.map((item) => this.prisma.category.update({
            where: { id: item.id },
            data: { sortOrder: item.sortOrder },
        })));
        return this.getAllCategories();
    }
    menuInclude = {
        category: true,
        optionGroups: {
            orderBy: { sortOrder: 'asc' },
            include: { options: { orderBy: { sortOrder: 'asc' } } },
        },
        recipes: { include: { ingredient: true } },
        _count: { select: { orderItems: true } },
    };
    async getAllMenuItems(categoryId) {
        return this.prisma.product.findMany({
            where: categoryId ? { categoryId } : undefined,
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
            include: this.menuInclude,
        });
    }
    async getMenuItemById(id) {
        const item = await this.prisma.product.findUnique({
            where: { id },
            include: this.menuInclude,
        });
        if (!item)
            throw new common_1.NotFoundException(`Menu item ${id} not found`);
        item.calculatedCost = this.calculateMenuCostLocal(item.recipes);
        return item;
    }
    calculateMenuCostLocal(recipes) {
        if (!recipes || recipes.length === 0)
            return 0;
        return recipes.reduce((total, r) => {
            const costPerUnit = r.ingredient?.costPerUnit || 0;
            return total + (r.quantity * costPerUnit);
        }, 0);
    }
    async getMenuCosting() {
        const items = await this.prisma.product.findMany({
            include: {
                category: true,
                recipes: { include: { ingredient: true } }
            }
        });
        return items.map(item => {
            const cogs = this.calculateMenuCostLocal(item.recipes);
            const profit = item.price - cogs;
            const margin = item.price > 0 ? (profit / item.price) * 100 : 0;
            return {
                ...item,
                cogs,
                profit,
                marginPercentage: margin
            };
        });
    }
    async createMenuItem(data) {
        const tagsJson = JSON.stringify(data.tags ?? []);
        return this.prisma.product.create({
            data: {
                name: data.name,
                description: data.description,
                price: data.price,
                categoryId: data.categoryId,
                imageUrl: data.imageUrl,
                status: data.status ?? 'AVAILABLE',
                tags: tagsJson,
                sortOrder: data.sortOrder ?? 0,
            },
            include: this.menuInclude,
        });
    }
    async updateMenuItem(id, data) {
        await this.getMenuItemById(id);
        const updateData = {
            ...data,
            tags: data.tags !== undefined ? JSON.stringify(data.tags) : undefined,
        };
        return this.prisma.product.update({
            where: { id },
            data: updateData,
            include: this.menuInclude,
        });
    }
    async toggleMenuStatus(id) {
        const item = await this.getMenuItemById(id);
        const nextStatus = item.status === 'AVAILABLE'
            ? 'OUT_OF_STOCK'
            : item.status === 'OUT_OF_STOCK'
                ? 'HIDDEN'
                : 'AVAILABLE';
        return this.prisma.product.update({
            where: { id },
            data: { status: nextStatus },
            include: this.menuInclude,
        });
    }
    async setMenuStatus(id, status) {
        await this.getMenuItemById(id);
        return this.prisma.product.update({
            where: { id },
            data: { status },
            include: this.menuInclude,
        });
    }
    async deleteMenuItem(id) {
        await this.getMenuItemById(id);
        await this.prisma.menuOption.deleteMany({
            where: { group: { productId: id } },
        });
        await this.prisma.menuOptionGroup.deleteMany({ where: { productId: id } });
        await this.prisma.recipe.deleteMany({ where: { productId: id } });
        return this.prisma.product.delete({ where: { id } });
    }
    async createOptionGroup(productId, data) {
        await this.getMenuItemById(productId);
        return this.prisma.menuOptionGroup.create({
            data: {
                productId,
                name: data.name,
                isRequired: data.isRequired ?? false,
                maxSelect: data.maxSelect ?? 1,
                sortOrder: data.sortOrder ?? 0,
            },
            include: { options: true },
        });
    }
    async updateOptionGroup(groupId, data) {
        return this.prisma.menuOptionGroup.update({
            where: { id: groupId },
            data,
            include: { options: true },
        });
    }
    async deleteOptionGroup(groupId) {
        await this.prisma.menuOption.deleteMany({ where: { groupId } });
        return this.prisma.menuOptionGroup.delete({ where: { id: groupId } });
    }
    async createOption(groupId, data) {
        return this.prisma.menuOption.create({
            data: {
                groupId,
                label: data.label,
                priceAddon: data.priceAddon ?? 0,
                isDefault: data.isDefault ?? false,
                sortOrder: data.sortOrder ?? 0,
            },
        });
    }
    async updateOption(optionId, data) {
        return this.prisma.menuOption.update({ where: { id: optionId }, data });
    }
    async deleteOption(optionId) {
        return this.prisma.menuOption.delete({ where: { id: optionId } });
    }
    async addRecipe(productId, ingredientId, quantity) {
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
    async getAllIngredients() {
        return this.prisma.ingredient.findMany({ orderBy: { name: 'asc' } });
    }
    async createIngredient(data) {
        return this.prisma.ingredient.create({
            data: {
                name: data.name,
                unit: data.unit,
                costPerUnit: data.costPerUnit || 0,
                sku: data.sku,
            }
        });
    }
    async updateIngredient(id, data) {
        return this.prisma.ingredient.update({
            where: { id },
            data
        });
    }
};
exports.MenuService = MenuService;
exports.MenuService = MenuService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MenuService);
//# sourceMappingURL=menu.service.js.map