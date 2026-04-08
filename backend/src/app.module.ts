import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaService } from './prisma.service';
import { OrderService } from './order.service';
import { OrderGateway } from './order.gateway';
import { AiService } from './ai.service';
import { InventoryService } from './inventory.service';
import { BranchService } from './branch.service';
import { ProductService } from './product.service';
import { MenuService } from './menu.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [PrismaService, OrderService, OrderGateway, AiService, InventoryService, BranchService, ProductService, MenuService],
})
export class AppModule {}
