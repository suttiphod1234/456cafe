import { Controller, Get, Post, Body, Param, Patch, Query, Delete, HttpCode } from '@nestjs/common';
import { OrderService } from './order.service';
import { BranchService } from './branch.service';
import { InventoryService } from './inventory.service';
import { ProductService } from './product.service';

@Controller('api')
export class AppController {
  constructor(
    private readonly orderService: OrderService,
    private readonly branchService: BranchService,
    private readonly inventoryService: InventoryService,
    private readonly productService: ProductService,
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
  async updateManager(@Param('managerId') managerId: string, @Body() body: any) {
    return this.branchService.updateManager(managerId, body);
  }

  @Delete('branches/managers/:managerId')
  @HttpCode(200)
  async deleteManager(@Param('managerId') managerId: string) {
    return this.branchService.deleteManager(managerId);
  }

  @Get('products')
  async getProducts() {
    return this.productService.getAllProducts();
  }

  @Get('products/ingredients')
  async getIngredients() {
    return this.productService.getAllIngredients();
  }

  @Get('products/:id')
  async getProduct(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }

  @Post('products')
  async createProduct(@Body() body: any) {
    return this.productService.createProduct(body);
  }

  @Patch('products/:id')
  async updateProduct(@Param('id') id: string, @Body() body: any) {
    return this.productService.updateProduct(id, body);
  }

  @Delete('products/:id')
  @HttpCode(200)
  async deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }

  @Post('products/:id/recipes')
  async addRecipe(
    @Param('id') id: string,
    @Body() body: { ingredientId: string; quantity: number },
  ) {
    return this.productService.addRecipe(id, body.ingredientId, body.quantity);
  }

  @Patch('recipes/:recipeId')
  async updateRecipe(
    @Param('recipeId') recipeId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.productService.updateRecipe(recipeId, quantity);
  }

  @Delete('recipes/:recipeId')
  @HttpCode(200)
  async deleteRecipe(@Param('recipeId') recipeId: string) {
    return this.productService.deleteRecipe(recipeId);
  }

  @Get('orders/recent')
  async getRecentOrders() {
    return this.orderService.getRecentOrders();
  }

  @Get('stats/global')
  async getGlobalStats() {
    return this.orderService.getGlobalStats();
  }

  @Post('orders')
  async createOrder(@Body() orderData: any) {
    return this.orderService.createOrder(orderData);
  }

  @Patch('orders/:id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.orderService.updateOrderStatus(id, status);
  }

  @Get('ai/recommend')
  async getAiRecommend(@Query('prompt') prompt: string) {
    return this.orderService.getAiRecommendation(prompt);
  }

  @Post('ai/translate')
  async translate(@Body() body: { text: string, targetLanguage: 'Thai' | 'English' }) {
    return this.orderService.getAiTranslate(body.text, body.targetLanguage);
  }

  @Get('health')
  getHealth() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
