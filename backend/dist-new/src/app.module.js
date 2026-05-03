"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const prisma_service_1 = require("./prisma.service");
const order_service_1 = require("./order.service");
const order_gateway_1 = require("./order.gateway");
const ai_service_1 = require("./ai.service");
const inventory_service_1 = require("./inventory.service");
const branch_service_1 = require("./branch.service");
const product_service_1 = require("./product.service");
const menu_service_1 = require("./menu.service");
const inventory_transaction_service_1 = require("./inventory-transaction.service");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const user_service_1 = require("./user.service");
const user_controller_1 = require("./user.controller");
const address_service_1 = require("./address.service");
const address_controller_1 = require("./address.controller");
const finance_service_1 = require("./finance.service");
const finance_controller_1 = require("./finance.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [
            app_controller_1.AppController,
            auth_controller_1.AuthController,
            user_controller_1.UserController,
            address_controller_1.AddressController,
            finance_controller_1.FinanceController,
        ],
        providers: [
            prisma_service_1.PrismaService,
            order_service_1.OrderService,
            order_gateway_1.OrderGateway,
            ai_service_1.AiService,
            inventory_service_1.InventoryService,
            branch_service_1.BranchService,
            product_service_1.ProductService,
            menu_service_1.MenuService,
            auth_service_1.AuthService,
            user_service_1.UserService,
            address_service_1.AddressService,
            inventory_transaction_service_1.InventoryTransactionService,
            finance_service_1.FinanceService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map