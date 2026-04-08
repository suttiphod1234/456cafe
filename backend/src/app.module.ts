import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaService } from './prisma.service';
import { OrderService } from './order.service';
import { OrderGateway } from './order.gateway';
import { AiService } from './ai.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [PrismaService, OrderService, OrderGateway, AiService],
})
export class AppModule {}
