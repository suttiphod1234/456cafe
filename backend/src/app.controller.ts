import { Controller, Get, Post, Body, Param, Patch, Query } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('api')
export class AppController {
  constructor(private readonly orderService: OrderService) {}

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
