import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { OrderService } from './order.service';
import { BranchService } from './branch.service';
import { InventoryService } from './inventory.service';
import { ProductService } from './product.service';
import { MenuService } from './menu.service';
import { InventoryTransactionService } from './inventory-transaction.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: OrderService,
          useValue: {
            getGlobalStats: jest.fn().mockResolvedValue({ total: 0 }),
          },
        },
        {
          provide: BranchService,
          useValue: { getAllBranches: jest.fn().mockResolvedValue([]) },
        },
        {
          provide: InventoryService,
          useValue: { getBranchInventory: jest.fn().mockResolvedValue([]) },
        },
        {
          provide: ProductService,
          useValue: { getAllProducts: jest.fn().mockResolvedValue([]) },
        },
        {
          provide: MenuService,
          useValue: { getAllMenuItems: jest.fn().mockResolvedValue([]) },
        },
        {
          provide: InventoryTransactionService,
          useValue: {
            getTransactions: jest.fn().mockResolvedValue([]),
            createTransaction: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('health', () => {
    it('should return "ok"', () => {
      expect(appController.getHealth().status).toBe('ok');
    });
  });
});
