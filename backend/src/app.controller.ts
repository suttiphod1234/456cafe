import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { BranchService } from './branch.service';
import { InventoryService } from './inventory.service';
import { ProductService } from './product.service';
import { MenuService } from './menu.service';

@Controller('api')
export class AppController {
  constructor(
    private readonly orderService: OrderService,
    private readonly branchService: BranchService,
    private readonly inventoryService: InventoryService,
    private readonly productService: ProductService,
    private readonly menuService: MenuService,
  ) {}

  // ─── Branch CRUD ────────────────────────────────────────────────────────────
  @Get('branches')
  async getBranches() {
    return this.branchService.getAllBranches();
  }

  @Get('branches/:id')
  async getBranch(@Param('id') id: string) {
    return this.branchService.getBranchById(id);
  }

  @Post('branches')
  async createBranch(@Body() body: any) {
    return this.branchService.createBranch(body);
  }

  @Patch('branches/:id')
  async updateBranch(@Param('id') id: string, @Body() body: any) {
    return this.branchService.updateBranch(id, body);
  }

  @Delete('branches/:id')
  @HttpCode(200)
  async deleteBranch(@Param('id') id: string) {
    return this.branchService.deleteBranch(id);
  }

  @Patch('branches/:id/toggle-open')
  async toggleBranchOpen(@Param('id') id: string) {
    return this.branchService.toggleBranchOpen(id);
  }

  // ─── Branch Stats / Dashboard / Orders ────────────────────────────────────
  @Get('branches/:id/stats')
  async getBranchStats(@Param('id') id: string) {
    return this.branchService.getBranchStats(id);
  }

  @Get('branches/:id/dashboard')
  async getBranchDashboard(@Param('id') id: string) {
    return this.branchService.getBranchDashboard(id);
  }

  @Get('branches/:id/orders')
  async getBranchOrders(@Param('id') id: string) {
    return this.branchService.getBranchOrders(id);
  }

  @Get('branches/:id/inventory')
  async getInventory(@Param('id') id: string) {
    return this.inventoryService.getBranchInventory(id);
  }

  // ─── Branch Manager CRUD ──────────────────────────────────────────────────
  @Get('branches/:id/managers')
  async getManagers(@Param('id') id: string) {
    return this.branchService.getManagers(id);
  }

  @Post('branches/:id/managers')
  async addManager(@Param('id') id: string, @Body() body: any) {
    return this.branchService.addManager(id, body);
  }

  @Patch('branches/managers/:managerId')
  async updateManager(
    @Param('managerId') managerId: string,
    @Body() body: any,
  ) {
    return this.branchService.updateManager(managerId, body);
  }

  @Delete('branches/managers/:managerId')
  @HttpCode(200)
  async deleteManager(@Param('managerId') managerId: string) {
    return this.branchService.deleteManager(managerId);
  }

  // ─── Legacy /api/products (buyer-liff backward compat) ──────────────────
  @Get('products')
  async getProducts() {
    return this.menuService.getAllMenuItems();
  }

  @Get('products/ingredients')
  async getIngredients() {
    return this.menuService.getAllIngredients();
  }

  @Get('products/:id')
  async getProduct(@Param('id') id: string) {
    return this.menuService.getMenuItemById(id);
  }

  @Post('products/:id/recipes')
  async addRecipeLegacy(
    @Param('id') id: string,
    @Body() body: { ingredientId: string; quantity: number },
  ) {
    return this.menuService.addRecipe(id, body.ingredientId, body.quantity);
  }

  @Patch('recipes/:recipeId')
  async updateRecipeLegacy(
    @Param('recipeId') recipeId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.menuService.updateRecipe(recipeId, quantity);
  }

  @Delete('recipes/:recipeId')
  @HttpCode(200)
  async deleteRecipeLegacy(@Param('recipeId') recipeId: string) {
    return this.menuService.deleteRecipe(recipeId);
  }

  // ─── Categories ───────────────────────────────────────────────────────────
  @Get('categories')
  async getCategories() {
    return this.menuService.getAllCategories();
  }

  @Post('categories')
  async createCategory(@Body() body: any) {
    return this.menuService.createCategory(body);
  }

  @Patch('categories/reorder')
  async reorderCategories(
    @Body() body: { items: { id: string; sortOrder: number }[] },
  ) {
    return this.menuService.reorderCategories(body.items);
  }

  @Patch('categories/:id')
  async updateCategory(@Param('id') id: string, @Body() body: any) {
    return this.menuService.updateCategory(id, body);
  }

  @Delete('categories/:id')
  @HttpCode(200)
  async deleteCategory(@Param('id') id: string) {
    return this.menuService.deleteCategory(id);
  }

  // ─── Menu Items ──────────────────────────────────────────────────────────
  @Get('menu')
  async getMenu(@Query('categoryId') categoryId?: string) {
    return this.menuService.getAllMenuItems(categoryId);
  }

  @Get('menu/ingredients')
  async getMenuIngredients() {
    return this.menuService.getAllIngredients();
  }

  @Get('menu/:id')
  async getMenuItem(@Param('id') id: string) {
    return this.menuService.getMenuItemById(id);
  }

  @Post('menu')
  async createMenuItem(@Body() body: any) {
    return this.menuService.createMenuItem(body);
  }

  @Patch('menu/:id')
  async updateMenuItem(@Param('id') id: string, @Body() body: any) {
    return this.menuService.updateMenuItem(id, body);
  }

  @Delete('menu/:id')
  @HttpCode(200)
  async deleteMenuItem(@Param('id') id: string) {
    return this.menuService.deleteMenuItem(id);
  }

  @Patch('menu/:id/status')
  async setMenuStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.menuService.setMenuStatus(id, status);
  }

  @Post('menu/:id/recipes')
  async addMenuRecipe(
    @Param('id') id: string,
    @Body() body: { ingredientId: string; quantity: number },
  ) {
    return this.menuService.addRecipe(id, body.ingredientId, body.quantity);
  }

  // ─── Option Groups ────────────────────────────────────────────────────────
  @Post('menu/:id/option-groups')
  async createOptionGroup(@Param('id') id: string, @Body() body: any) {
    return this.menuService.createOptionGroup(id, body);
  }

  @Patch('menu/option-groups/:groupId')
  async updateOptionGroup(
    @Param('groupId') groupId: string,
    @Body() body: any,
  ) {
    return this.menuService.updateOptionGroup(groupId, body);
  }

  @Delete('menu/option-groups/:groupId')
  @HttpCode(200)
  async deleteOptionGroup(@Param('groupId') groupId: string) {
    return this.menuService.deleteOptionGroup(groupId);
  }

  // ─── Options ─────────────────────────────────────────────────────────────
  @Post('menu/option-groups/:groupId/options')
  async createOption(@Param('groupId') groupId: string, @Body() body: any) {
    return this.menuService.createOption(groupId, body);
  }

  @Patch('menu/options/:optionId')
  async updateOption(@Param('optionId') optionId: string, @Body() body: any) {
    return this.menuService.updateOption(optionId, body);
  }

  @Delete('menu/options/:optionId')
  @HttpCode(200)
  async deleteOption(@Param('optionId') optionId: string) {
    return this.menuService.deleteOption(optionId);
  }

  // ─── Orders ────────────────────────────────────────────────────────────
  @Get('orders')
  async getOrders(
    @Query('branchId') branchId?: string,
    @Query('status') status?: string,
    @Query('date') date?: string,
    @Query('search') search?: string,
  ) {
    return this.orderService.getAllOrders({ branchId, status, date, search });
  }

  @Get('orders/recent')
  async getRecentOrders(@Query('limit') limit?: string) {
    return this.orderService.getRecentOrders(limit ? parseInt(limit) : 10);
  }

  @Get('orders/stats')
  async getOrderStats(@Query('branchId') branchId?: string) {
    return this.orderService.getOrderStats(branchId);
  }

  @Get('orders/customer/:uid')
  async getCustomerOrders(@Param('uid') uid: string) {
    return this.orderService.getCustomerOrders(uid);
  }

  @Get('orders/:id')
  async getOrder(@Param('id') id: string) {
    return this.orderService.getOrderById(id);
  }

  @Post('orders')
  async createOrder(@Body() orderData: any) {
    return this.orderService.createOrder(orderData);
  }

  @Patch('orders/:id/status')
  async updateOrderStatus(@Param('id') id: string, @Body() body: any) {
    return this.orderService.updateOrderStatus(id, body.status, body.metadata);
  }

  @Patch('orders/:id/payment')
  async updatePayment(@Param('id') id: string, @Body() body: any) {
    return this.orderService.updatePaymentStatus(id, body);
  }

  @Patch('orders/:id/cancel')
  async cancelOrder(@Param('id') id: string, @Body('reason') reason?: string) {
    return this.orderService.cancelOrder(id, reason);
  }

  @Get('stats/global')
  async getGlobalStats() {
    return this.orderService.getGlobalStats();
  }

  // ─── AI ────────────────────────────────────────────────────────────────
  @Get('ai/recommend')
  async getAiRecommend(@Query('prompt') prompt: string) {
    return this.orderService.getAiRecommendation(prompt);
  }

  @Post('ai/translate')
  async translate(
    @Body() body: { text: string; targetLanguage: 'Thai' | 'English' },
  ) {
    return this.orderService.getAiTranslate(body.text, body.targetLanguage);
  }

  @Get('health')
  getHealth() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
