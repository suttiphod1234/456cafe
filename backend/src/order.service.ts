import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { OrderGateway } from './order.gateway';
import { AiService } from './ai.service';
import { InventoryService } from './inventory.service';
import { UserService } from './user.service';
import { Prisma, OrderStatus, PaymentStatus } from '@prisma/client';

export interface CreateOrderDto {
    branchId: string;
    userId?: string;
    customerUid?: string;
    customerName?: string;
    totalAmount: number;
    fulfillmentType?: string;
    note?: string;
    scheduledAt?: string | Date;
    paymentMethod?: string;
    platform?: string;
    items: Array<{
      productId: string;
      quantity: number;
      unitPrice?: number;
      price: number;
      optionsPrice?: number;
      productName?: string;
      name?: string;
      customization?: any;
      selectedOptions?: any;
    }>;
}

@Injectable()
  export class OrderService {
    constructor(
          private prisma: PrismaService,
          private gateway: OrderGateway,
          private ai: AiService,
          private inventory: InventoryService,
          private userService: UserService,
        ) {}

  // 
