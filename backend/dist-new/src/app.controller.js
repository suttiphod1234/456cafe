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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const order_service_1 = require("./order.service");
const branch_service_1 = require("./branch.service");
const inventory_service_1 = require("./inventory.service");
const product_service_1 = require("./product.service");
const menu_service_1 = require("./menu.service");
const inventory_transaction_service_1 = require("./inventory-transaction.service");
let AppController = class AppController {
    orderService;
    branchService;
    inventoryService;
    productService;
    menuService;
    inventoryTransactionService;
    constructor(orderService, branchService, inventoryService, productService, menuService, inventoryTransactionService) {
        this.orderService = orderService;
        this.branchService = branchService;
        this.inventoryService = inventoryService;
        this.productService = productService;
        this.menuService = menuService;
        this.inventoryTransactionService = inventoryTransactionService;
    }
    async getBranches() {
        return this.branchService.getAllBranches();
    }
    async getBranch(id) {
        return this.branchService.getBranchById(id);
    }
    async createBranch(body) {
        return this.branchService.createBranch(body);
    }
    async updateBranch(id, body) {
        return this.branchService.updateBranch(id, body);
    }
    async deleteBranch(id) {
        return this.branchService.deleteBranch(id);
    }
    async toggleBranchOpen(id) {
        return this.branchService.toggleBranchOpen(id);
    }
    async getBranchStats(id) {
        return this.branchService.getBranchStats(id);
    }
    async getBranchDashboard(id) {
        return this.branchService.getBranchDashboard(id);
    }
    async getBranchOrders(id) {
        return this.branchService.getBranchOrders(id);
    }
    async getInventory(id) {
        return this.inventoryService.getBranchInventory(id);
    }
    async getInventoryTransactions(branchId, ingredientId, type) {
        return this.inventoryTransactionService.getTransactions({ branchId, ingredientId, type });
    }
    async createInventoryTransaction(body) {
        return this.inventoryTransactionService.createTransaction(body);
    }
    async getManagers(id) {
        return this.branchService.getManagers(id);
    }
    async addManager(id, body) {
        return this.branchService.addManager(id, body);
    }
    async updateManager(managerId, body) {
        return this.branchService.updateManager(managerId, body);
    }
    async deleteManager(managerId) {
        return this.branchService.deleteManager(managerId);
    }
    async getProducts() {
        return this.menuService.getAllMenuItems();
    }
    async getIngredients() {
        return this.menuService.getAllIngredients();
    }
    async createIngredient(body) {
        return this.menuService.createIngredient(body);
    }
    async updateIngredient(id, body) {
        return this.menuService.updateIngredient(id, body);
    }
    async getProduct(id) {
        return this.menuService.getMenuItemById(id);
    }
    async addRecipeLegacy(id, body) {
        return this.menuService.addRecipe(id, body.ingredientId, body.quantity);
    }
    async updateRecipeLegacy(recipeId, quantity) {
        return this.menuService.updateRecipe(recipeId, quantity);
    }
    async deleteRecipeLegacy(recipeId) {
        return this.menuService.deleteRecipe(recipeId);
    }
    async getCategories() {
        return this.menuService.getAllCategories();
    }
    async createCategory(body) {
        return this.menuService.createCategory(body);
    }
    async reorderCategories(body) {
        return this.menuService.reorderCategories(body.items);
    }
    async updateCategory(id, body) {
        return this.menuService.updateCategory(id, body);
    }
    async deleteCategory(id) {
        return this.menuService.deleteCategory(id);
    }
    async getMenu(categoryId) {
        return this.menuService.getAllMenuItems(categoryId);
    }
    async getMenuIngredients() {
        return this.menuService.getAllIngredients();
    }
    async getMenuCosting() {
        return this.menuService.getMenuCosting();
    }
    async getMenuItem(id) {
        return this.menuService.getMenuItemById(id);
    }
    async createMenuItem(body) {
        return this.menuService.createMenuItem(body);
    }
    async updateMenuItem(id, body) {
        return this.menuService.updateMenuItem(id, body);
    }
    async deleteMenuItem(id) {
        return this.menuService.deleteMenuItem(id);
    }
    async setMenuStatus(id, status) {
        return this.menuService.setMenuStatus(id, status);
    }
    async addMenuRecipe(id, body) {
        return this.menuService.addRecipe(id, body.ingredientId, body.quantity);
    }
    async createOptionGroup(id, body) {
        return this.menuService.createOptionGroup(id, body);
    }
    async updateOptionGroup(groupId, body) {
        return this.menuService.updateOptionGroup(groupId, body);
    }
    async deleteOptionGroup(groupId) {
        return this.menuService.deleteOptionGroup(groupId);
    }
    async createOption(groupId, body) {
        return this.menuService.createOption(groupId, body);
    }
    async updateOption(optionId, body) {
        return this.menuService.updateOption(optionId, body);
    }
    async deleteOption(optionId) {
        return this.menuService.deleteOption(optionId);
    }
    async getOrders(branchId, status, date, search) {
        return this.orderService.getAllOrders({ branchId, status, date, search });
    }
    async getRecentOrders(limit) {
        return this.orderService.getRecentOrders(limit ? parseInt(limit) : 10);
    }
    async getOrderStats(branchId) {
        return this.orderService.getOrderStats(branchId);
    }
    async getCustomerOrders(uid) {
        return this.orderService.getCustomerOrders(uid);
    }
    async getOrder(id) {
        return this.orderService.getOrderById(id);
    }
    async createOrder(orderData) {
        return this.orderService.createOrder(orderData);
    }
    async updateOrderStatus(id, body) {
        return this.orderService.updateOrderStatus(id, body.status, body.metadata);
    }
    async updatePayment(id, body) {
        return this.orderService.updatePaymentStatus(id, body);
    }
    async cancelOrder(id, reason) {
        return this.orderService.cancelOrder(id, reason);
    }
    async getGlobalStats() {
        return this.orderService.getGlobalStats();
    }
    async getAiRecommend(prompt) {
        return this.orderService.getAiRecommendation(prompt);
    }
    async translate(body) {
        return this.orderService.getAiTranslate(body.text, body.targetLanguage);
    }
    getHealth() {
        return { status: 'ok', timestamp: new Date().toISOString() };
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)('branches'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getBranches", null);
__decorate([
    (0, common_1.Get)('branches/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getBranch", null);
__decorate([
    (0, common_1.Post)('branches'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "createBranch", null);
__decorate([
    (0, common_1.Patch)('branches/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "updateBranch", null);
__decorate([
    (0, common_1.Delete)('branches/:id'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "deleteBranch", null);
__decorate([
    (0, common_1.Patch)('branches/:id/toggle-open'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "toggleBranchOpen", null);
__decorate([
    (0, common_1.Get)('branches/:id/stats'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getBranchStats", null);
__decorate([
    (0, common_1.Get)('branches/:id/dashboard'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getBranchDashboard", null);
__decorate([
    (0, common_1.Get)('branches/:id/orders'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getBranchOrders", null);
__decorate([
    (0, common_1.Get)('branches/:id/inventory'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getInventory", null);
__decorate([
    (0, common_1.Get)('inventory/transactions'),
    __param(0, (0, common_1.Query)('branchId')),
    __param(1, (0, common_1.Query)('ingredientId')),
    __param(2, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getInventoryTransactions", null);
__decorate([
    (0, common_1.Post)('inventory/transactions'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "createInventoryTransaction", null);
__decorate([
    (0, common_1.Get)('branches/:id/managers'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getManagers", null);
__decorate([
    (0, common_1.Post)('branches/:id/managers'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "addManager", null);
__decorate([
    (0, common_1.Patch)('branches/managers/:managerId'),
    __param(0, (0, common_1.Param)('managerId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "updateManager", null);
__decorate([
    (0, common_1.Delete)('branches/managers/:managerId'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('managerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "deleteManager", null);
__decorate([
    (0, common_1.Get)('products'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getProducts", null);
__decorate([
    (0, common_1.Get)('products/ingredients'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getIngredients", null);
__decorate([
    (0, common_1.Post)('products/ingredients'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "createIngredient", null);
__decorate([
    (0, common_1.Patch)('products/ingredients/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "updateIngredient", null);
__decorate([
    (0, common_1.Get)('products/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getProduct", null);
__decorate([
    (0, common_1.Post)('products/:id/recipes'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "addRecipeLegacy", null);
__decorate([
    (0, common_1.Patch)('recipes/:recipeId'),
    __param(0, (0, common_1.Param)('recipeId')),
    __param(1, (0, common_1.Body)('quantity')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "updateRecipeLegacy", null);
__decorate([
    (0, common_1.Delete)('recipes/:recipeId'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('recipeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "deleteRecipeLegacy", null);
__decorate([
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Post)('categories'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Patch)('categories/reorder'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "reorderCategories", null);
__decorate([
    (0, common_1.Patch)('categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Delete)('categories/:id'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "deleteCategory", null);
__decorate([
    (0, common_1.Get)('menu'),
    __param(0, (0, common_1.Query)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getMenu", null);
__decorate([
    (0, common_1.Get)('menu/ingredients'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getMenuIngredients", null);
__decorate([
    (0, common_1.Get)('menu/costing'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getMenuCosting", null);
__decorate([
    (0, common_1.Get)('menu/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getMenuItem", null);
__decorate([
    (0, common_1.Post)('menu'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "createMenuItem", null);
__decorate([
    (0, common_1.Patch)('menu/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "updateMenuItem", null);
__decorate([
    (0, common_1.Delete)('menu/:id'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "deleteMenuItem", null);
__decorate([
    (0, common_1.Patch)('menu/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "setMenuStatus", null);
__decorate([
    (0, common_1.Post)('menu/:id/recipes'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "addMenuRecipe", null);
__decorate([
    (0, common_1.Post)('menu/:id/option-groups'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "createOptionGroup", null);
__decorate([
    (0, common_1.Patch)('menu/option-groups/:groupId'),
    __param(0, (0, common_1.Param)('groupId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "updateOptionGroup", null);
__decorate([
    (0, common_1.Delete)('menu/option-groups/:groupId'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('groupId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "deleteOptionGroup", null);
__decorate([
    (0, common_1.Post)('menu/option-groups/:groupId/options'),
    __param(0, (0, common_1.Param)('groupId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "createOption", null);
__decorate([
    (0, common_1.Patch)('menu/options/:optionId'),
    __param(0, (0, common_1.Param)('optionId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "updateOption", null);
__decorate([
    (0, common_1.Delete)('menu/options/:optionId'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('optionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "deleteOption", null);
__decorate([
    (0, common_1.Get)('orders'),
    __param(0, (0, common_1.Query)('branchId')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('date')),
    __param(3, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getOrders", null);
__decorate([
    (0, common_1.Get)('orders/recent'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getRecentOrders", null);
__decorate([
    (0, common_1.Get)('orders/stats'),
    __param(0, (0, common_1.Query)('branchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getOrderStats", null);
__decorate([
    (0, common_1.Get)('orders/customer/:uid'),
    __param(0, (0, common_1.Param)('uid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getCustomerOrders", null);
__decorate([
    (0, common_1.Get)('orders/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getOrder", null);
__decorate([
    (0, common_1.Post)('orders'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Patch)('orders/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "updateOrderStatus", null);
__decorate([
    (0, common_1.Patch)('orders/:id/payment'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "updatePayment", null);
__decorate([
    (0, common_1.Patch)('orders/:id/cancel'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "cancelOrder", null);
__decorate([
    (0, common_1.Get)('stats/global'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getGlobalStats", null);
__decorate([
    (0, common_1.Get)('ai/recommend'),
    __param(0, (0, common_1.Query)('prompt')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getAiRecommend", null);
__decorate([
    (0, common_1.Post)('ai/translate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "translate", null);
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getHealth", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [order_service_1.OrderService,
        branch_service_1.BranchService,
        inventory_service_1.InventoryService,
        product_service_1.ProductService,
        menu_service_1.MenuService,
        inventory_transaction_service_1.InventoryTransactionService])
], AppController);
//# sourceMappingURL=app.controller.js.map