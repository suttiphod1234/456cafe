import { Controller, Get, Post, Body, Param, Patch, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { BranchService } from './branch.service';
import { InventoryService } from './inventory.service';

@Controller('api')
export class AppController {
  constructor(
    private readonly orderService: OrderService,
    private readonly branchService: BranchService,
    private readonly inventoryService: InventoryService
  ) {}

  @Get('branches')
  async getBranches() {
    return this.branchService.getAllBranches();
  }

  @Get('branches/:id/stats')
  async getBranchStats(@Param('id') id: string) {
    return this.branchService.getBranchStats(id);
  }

  @Get('branches/:id/inventory')
  async getInventory(@Param('id') id: string) {
    return this.inventoryService.getBranchInventory(id);
  }

  @Get('products')
  async getProducts() {
    return this.branchService.getProducts();
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
