import { OrderService } from './order.service';
import { BranchService } from './branch.service';
import { InventoryService } from './inventory.service';
import { ProductService } from './product.service';
import { MenuService } from './menu.service';
import { InventoryTransactionService } from './inventory-transaction.service';
export declare class AppController {
    private readonly orderService;
    private readonly branchService;
    private readonly inventoryService;
    private readonly productService;
    private readonly menuService;
    private readonly inventoryTransactionService;
    constructor(orderService: OrderService, branchService: BranchService, inventoryService: InventoryService, productService: ProductService, menuService: MenuService, inventoryTransactionService: InventoryTransactionService);
    getBranches(): Promise<({
        _count: {
            inventory: number;
            orders: number;
        };
        managers: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            branchId: string;
            email: string | null;
            phone: string | null;
            role: string;
            lineUid: string | null;
        }[];
    } & {
        address: string | null;
        id: string;
        latitude: number | null;
        longitude: number | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        imageUrl: string | null;
        phone: string | null;
        location: string | null;
        isOpen: boolean;
        openTime: string | null;
        closeTime: string | null;
        promptpayId: string | null;
        promptpayName: string | null;
    })[]>;
    getBranch(id: string): Promise<{
        _count: {
            inventory: number;
            orders: number;
        };
        managers: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            branchId: string;
            email: string | null;
            phone: string | null;
            role: string;
            lineUid: string | null;
        }[];
    } & {
        address: string | null;
        id: string;
        latitude: number | null;
        longitude: number | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        imageUrl: string | null;
        phone: string | null;
        location: string | null;
        isOpen: boolean;
        openTime: string | null;
        closeTime: string | null;
        promptpayId: string | null;
        promptpayName: string | null;
    }>;
    createBranch(body: Record<string, unknown>): Promise<{
        _count: {
            inventory: number;
            orders: number;
        };
        managers: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            branchId: string;
            email: string | null;
            phone: string | null;
            role: string;
            lineUid: string | null;
        }[];
    } & {
        address: string | null;
        id: string;
        latitude: number | null;
        longitude: number | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        imageUrl: string | null;
        phone: string | null;
        location: string | null;
        isOpen: boolean;
        openTime: string | null;
        closeTime: string | null;
        promptpayId: string | null;
        promptpayName: string | null;
    }>;
    updateBranch(id: string, body: Record<string, unknown>): Promise<{
        _count: {
            inventory: number;
            orders: number;
        };
        managers: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            branchId: string;
            email: string | null;
            phone: string | null;
            role: string;
            lineUid: string | null;
        }[];
    } & {
        address: string | null;
        id: string;
        latitude: number | null;
        longitude: number | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        imageUrl: string | null;
        phone: string | null;
        location: string | null;
        isOpen: boolean;
        openTime: string | null;
        closeTime: string | null;
        promptpayId: string | null;
        promptpayName: string | null;
    }>;
    deleteBranch(id: string): Promise<{
        address: string | null;
        id: string;
        latitude: number | null;
        longitude: number | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        imageUrl: string | null;
        phone: string | null;
        location: string | null;
        isOpen: boolean;
        openTime: string | null;
        closeTime: string | null;
        promptpayId: string | null;
        promptpayName: string | null;
    }>;
    toggleBranchOpen(id: string): Promise<{
        _count: {
            inventory: number;
            orders: number;
        };
        managers: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            branchId: string;
            email: string | null;
            phone: string | null;
            role: string;
            lineUid: string | null;
        }[];
    } & {
        address: string | null;
        id: string;
        latitude: number | null;
        longitude: number | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        imageUrl: string | null;
        phone: string | null;
        location: string | null;
        isOpen: boolean;
        openTime: string | null;
        closeTime: string | null;
        promptpayId: string | null;
        promptpayName: string | null;
    }>;
    getBranchStats(id: string): Promise<{
        totalOrders: number;
        revenue: number;
    }>;
    getBranchDashboard(id: string): Promise<{
        totalOrders: number;
        todayOrders: number;
        totalRevenue: number;
        todayRevenue: number;
        recentOrders: ({
            items: ({
                product: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    description: string | null;
                    status: string;
                    price: number;
                    categoryId: string | null;
                    imageUrl: string | null;
                    tags: string;
                    sortOrder: number;
                };
            } & {
                id: string;
                quantity: number;
                orderId: string;
                productId: string;
                unitPrice: number;
                optionsPrice: number;
                price: number;
                productName: string | null;
                customization: import("@prisma/client/runtime/library").JsonValue | null;
                selectedOptions: import("@prisma/client/runtime/library").JsonValue | null;
            })[];
        } & {
            id: string;
            userId: string | null;
            createdAt: Date;
            updatedAt: Date;
            branchId: string;
            orderNo: string;
            customerUid: string;
            customerName: string | null;
            totalAmount: number;
            status: import(".prisma/client").$Enums.OrderStatus;
            fulfillmentType: string;
            note: string | null;
            platform: string;
            riderName: string | null;
            riderPhone: string | null;
            qcNote: string | null;
            scheduledAt: Date | null;
            queueNo: number;
        })[];
        topProducts: {
            productId: string;
            name: string;
            totalSold: number;
        }[];
    }>;
    getBranchOrders(id: string): Promise<({
        items: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                status: string;
                price: number;
                categoryId: string | null;
                imageUrl: string | null;
                tags: string;
                sortOrder: number;
            };
        } & {
            id: string;
            quantity: number;
            orderId: string;
            productId: string;
            unitPrice: number;
            optionsPrice: number;
            price: number;
            productName: string | null;
            customization: import("@prisma/client/runtime/library").JsonValue | null;
            selectedOptions: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
    } & {
        id: string;
        userId: string | null;
        createdAt: Date;
        updatedAt: Date;
        branchId: string;
        orderNo: string;
        customerUid: string;
        customerName: string | null;
        totalAmount: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        fulfillmentType: string;
        note: string | null;
        platform: string;
        riderName: string | null;
        riderPhone: string | null;
        qcNote: string | null;
        scheduledAt: Date | null;
        queueNo: number;
    })[]>;
    getInventory(id: string): Promise<({
        ingredient: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            unit: string;
            costPerUnit: number;
            sku: string | null;
        };
    } & {
        id: string;
        updatedAt: Date;
        branchId: string;
        ingredientId: string;
        quantity: number;
        lowStockThreshold: number;
    })[]>;
    getInventoryTransactions(branchId?: string, ingredientId?: string, type?: string): Promise<({
        ingredient: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            unit: string;
            costPerUnit: number;
            sku: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        branchId: string;
        ingredientId: string;
        quantity: number;
        note: string | null;
        type: string;
        unitCost: number;
        totalCost: number;
        referenceId: string | null;
        createdBy: string | null;
    })[]>;
    createInventoryTransaction(body: Record<string, unknown>): Promise<{
        id: string;
        createdAt: Date;
        branchId: string;
        ingredientId: string;
        quantity: number;
        note: string | null;
        type: string;
        unitCost: number;
        totalCost: number;
        referenceId: string | null;
        createdBy: string | null;
    }>;
    getManagers(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        branchId: string;
        email: string | null;
        phone: string | null;
        role: string;
        lineUid: string | null;
    }[]>;
    addManager(id: string, body: Record<string, unknown>): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        branchId: string;
        email: string | null;
        phone: string | null;
        role: string;
        lineUid: string | null;
    }>;
    updateManager(managerId: string, body: Record<string, unknown>): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        branchId: string;
        email: string | null;
        phone: string | null;
        role: string;
        lineUid: string | null;
    }>;
    deleteManager(managerId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        branchId: string;
        email: string | null;
        phone: string | null;
        role: string;
        lineUid: string | null;
    }>;
    getProducts(): Promise<({
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            imageUrl: string | null;
            sortOrder: number;
            icon: string | null;
            isVisible: boolean;
        } | null;
        recipes: ({
            ingredient: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                unit: string;
                costPerUnit: number;
                sku: string | null;
            };
        } & {
            id: string;
            ingredientId: string;
            quantity: number;
            productId: string;
        })[];
        optionGroups: ({
            options: {
                id: string;
                label: string;
                isDefault: boolean;
                sortOrder: number;
                groupId: string;
                priceAddon: number;
            }[];
        } & {
            id: string;
            name: string;
            productId: string;
            sortOrder: number;
            isRequired: boolean;
            maxSelect: number;
        })[];
        _count: {
            orderItems: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        status: string;
        price: number;
        categoryId: string | null;
        imageUrl: string | null;
        tags: string;
        sortOrder: number;
    })[]>;
    getIngredients(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        unit: string;
        costPerUnit: number;
        sku: string | null;
    }[]>;
    createIngredient(body: Record<string, unknown>): Promise<any>;
    updateIngredient(id: string, body: Record<string, unknown>): Promise<any>;
    getProduct(id: string): Promise<{
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            imageUrl: string | null;
            sortOrder: number;
            icon: string | null;
            isVisible: boolean;
        } | null;
        recipes: ({
            ingredient: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                unit: string;
                costPerUnit: number;
                sku: string | null;
            };
        } & {
            id: string;
            ingredientId: string;
            quantity: number;
            productId: string;
        })[];
        optionGroups: ({
            options: {
                id: string;
                label: string;
                isDefault: boolean;
                sortOrder: number;
                groupId: string;
                priceAddon: number;
            }[];
        } & {
            id: string;
            name: string;
            productId: string;
            sortOrder: number;
            isRequired: boolean;
            maxSelect: number;
        })[];
        _count: {
            orderItems: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        status: string;
        price: number;
        categoryId: string | null;
        imageUrl: string | null;
        tags: string;
        sortOrder: number;
    }>;
    addRecipeLegacy(id: string, body: {
        ingredientId: string;
        quantity: number;
    }): Promise<{
        ingredient: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            unit: string;
            costPerUnit: number;
            sku: string | null;
        };
    } & {
        id: string;
        ingredientId: string;
        quantity: number;
        productId: string;
    }>;
    updateRecipeLegacy(recipeId: string, quantity: number): Promise<{
        ingredient: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            unit: string;
            costPerUnit: number;
            sku: string | null;
        };
    } & {
        id: string;
        ingredientId: string;
        quantity: number;
        productId: string;
    }>;
    deleteRecipeLegacy(recipeId: string): Promise<{
        id: string;
        ingredientId: string;
        quantity: number;
        productId: string;
    }>;
    getCategories(): Promise<({
        _count: {
            products: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        imageUrl: string | null;
        sortOrder: number;
        icon: string | null;
        isVisible: boolean;
    })[]>;
    createCategory(body: Record<string, unknown>): Promise<{
        _count: {
            products: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        imageUrl: string | null;
        sortOrder: number;
        icon: string | null;
        isVisible: boolean;
    }>;
    reorderCategories(body: {
        items: {
            id: string;
            sortOrder: number;
        }[];
    }): Promise<({
        _count: {
            products: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        imageUrl: string | null;
        sortOrder: number;
        icon: string | null;
        isVisible: boolean;
    })[]>;
    updateCategory(id: string, body: Record<string, unknown>): Promise<{
        _count: {
            products: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        imageUrl: string | null;
        sortOrder: number;
        icon: string | null;
        isVisible: boolean;
    }>;
    deleteCategory(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        imageUrl: string | null;
        sortOrder: number;
        icon: string | null;
        isVisible: boolean;
    }>;
    getMenu(categoryId?: string): Promise<({
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            imageUrl: string | null;
            sortOrder: number;
            icon: string | null;
            isVisible: boolean;
        } | null;
        recipes: ({
            ingredient: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                unit: string;
                costPerUnit: number;
                sku: string | null;
            };
        } & {
            id: string;
            ingredientId: string;
            quantity: number;
            productId: string;
        })[];
        optionGroups: ({
            options: {
                id: string;
                label: string;
                isDefault: boolean;
                sortOrder: number;
                groupId: string;
                priceAddon: number;
            }[];
        } & {
            id: string;
            name: string;
            productId: string;
            sortOrder: number;
            isRequired: boolean;
            maxSelect: number;
        })[];
        _count: {
            orderItems: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        status: string;
        price: number;
        categoryId: string | null;
        imageUrl: string | null;
        tags: string;
        sortOrder: number;
    })[]>;
    getMenuIngredients(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        unit: string;
        costPerUnit: number;
        sku: string | null;
    }[]>;
    getMenuCosting(): Promise<{
        cogs: number;
        profit: number;
        marginPercentage: number;
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            imageUrl: string | null;
            sortOrder: number;
            icon: string | null;
            isVisible: boolean;
        } | null;
        recipes: ({
            ingredient: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                unit: string;
                costPerUnit: number;
                sku: string | null;
            };
        } & {
            id: string;
            ingredientId: string;
            quantity: number;
            productId: string;
        })[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        status: string;
        price: number;
        categoryId: string | null;
        imageUrl: string | null;
        tags: string;
        sortOrder: number;
    }[]>;
    getMenuItem(id: string): Promise<{
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            imageUrl: string | null;
            sortOrder: number;
            icon: string | null;
            isVisible: boolean;
        } | null;
        recipes: ({
            ingredient: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                unit: string;
                costPerUnit: number;
                sku: string | null;
            };
        } & {
            id: string;
            ingredientId: string;
            quantity: number;
            productId: string;
        })[];
        optionGroups: ({
            options: {
                id: string;
                label: string;
                isDefault: boolean;
                sortOrder: number;
                groupId: string;
                priceAddon: number;
            }[];
        } & {
            id: string;
            name: string;
            productId: string;
            sortOrder: number;
            isRequired: boolean;
            maxSelect: number;
        })[];
        _count: {
            orderItems: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        status: string;
        price: number;
        categoryId: string | null;
        imageUrl: string | null;
        tags: string;
        sortOrder: number;
    }>;
    createMenuItem(body: Record<string, unknown>): Promise<{
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            imageUrl: string | null;
            sortOrder: number;
            icon: string | null;
            isVisible: boolean;
        } | null;
        recipes: ({
            ingredient: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                unit: string;
                costPerUnit: number;
                sku: string | null;
            };
        } & {
            id: string;
            ingredientId: string;
            quantity: number;
            productId: string;
        })[];
        optionGroups: ({
            options: {
                id: string;
                label: string;
                isDefault: boolean;
                sortOrder: number;
                groupId: string;
                priceAddon: number;
            }[];
        } & {
            id: string;
            name: string;
            productId: string;
            sortOrder: number;
            isRequired: boolean;
            maxSelect: number;
        })[];
        _count: {
            orderItems: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        status: string;
        price: number;
        categoryId: string | null;
        imageUrl: string | null;
        tags: string;
        sortOrder: number;
    }>;
    updateMenuItem(id: string, body: Record<string, unknown>): Promise<{
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            imageUrl: string | null;
            sortOrder: number;
            icon: string | null;
            isVisible: boolean;
        } | null;
        recipes: ({
            ingredient: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                unit: string;
                costPerUnit: number;
                sku: string | null;
            };
        } & {
            id: string;
            ingredientId: string;
            quantity: number;
            productId: string;
        })[];
        optionGroups: ({
            options: {
                id: string;
                label: string;
                isDefault: boolean;
                sortOrder: number;
                groupId: string;
                priceAddon: number;
            }[];
        } & {
            id: string;
            name: string;
            productId: string;
            sortOrder: number;
            isRequired: boolean;
            maxSelect: number;
        })[];
        _count: {
            orderItems: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        status: string;
        price: number;
        categoryId: string | null;
        imageUrl: string | null;
        tags: string;
        sortOrder: number;
    }>;
    deleteMenuItem(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        status: string;
        price: number;
        categoryId: string | null;
        imageUrl: string | null;
        tags: string;
        sortOrder: number;
    }>;
    setMenuStatus(id: string, status: string): Promise<{
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            imageUrl: string | null;
            sortOrder: number;
            icon: string | null;
            isVisible: boolean;
        } | null;
        recipes: ({
            ingredient: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                unit: string;
                costPerUnit: number;
                sku: string | null;
            };
        } & {
            id: string;
            ingredientId: string;
            quantity: number;
            productId: string;
        })[];
        optionGroups: ({
            options: {
                id: string;
                label: string;
                isDefault: boolean;
                sortOrder: number;
                groupId: string;
                priceAddon: number;
            }[];
        } & {
            id: string;
            name: string;
            productId: string;
            sortOrder: number;
            isRequired: boolean;
            maxSelect: number;
        })[];
        _count: {
            orderItems: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        status: string;
        price: number;
        categoryId: string | null;
        imageUrl: string | null;
        tags: string;
        sortOrder: number;
    }>;
    addMenuRecipe(id: string, body: {
        ingredientId: string;
        quantity: number;
    }): Promise<{
        ingredient: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            unit: string;
            costPerUnit: number;
            sku: string | null;
        };
    } & {
        id: string;
        ingredientId: string;
        quantity: number;
        productId: string;
    }>;
    createOptionGroup(id: string, body: Record<string, unknown>): Promise<{
        options: {
            id: string;
            label: string;
            isDefault: boolean;
            sortOrder: number;
            groupId: string;
            priceAddon: number;
        }[];
    } & {
        id: string;
        name: string;
        productId: string;
        sortOrder: number;
        isRequired: boolean;
        maxSelect: number;
    }>;
    updateOptionGroup(groupId: string, body: Record<string, unknown>): Promise<{
        options: {
            id: string;
            label: string;
            isDefault: boolean;
            sortOrder: number;
            groupId: string;
            priceAddon: number;
        }[];
    } & {
        id: string;
        name: string;
        productId: string;
        sortOrder: number;
        isRequired: boolean;
        maxSelect: number;
    }>;
    deleteOptionGroup(groupId: string): Promise<{
        id: string;
        name: string;
        productId: string;
        sortOrder: number;
        isRequired: boolean;
        maxSelect: number;
    }>;
    createOption(groupId: string, body: Record<string, unknown>): Promise<{
        id: string;
        label: string;
        isDefault: boolean;
        sortOrder: number;
        groupId: string;
        priceAddon: number;
    }>;
    updateOption(optionId: string, body: Record<string, unknown>): Promise<{
        id: string;
        label: string;
        isDefault: boolean;
        sortOrder: number;
        groupId: string;
        priceAddon: number;
    }>;
    deleteOption(optionId: string): Promise<{
        id: string;
        label: string;
        isDefault: boolean;
        sortOrder: number;
        groupId: string;
        priceAddon: number;
    }>;
    getOrders(branchId?: string, status?: string, date?: string, search?: string): Promise<({
        branch: {
            address: string | null;
            id: string;
            latitude: number | null;
            longitude: number | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            imageUrl: string | null;
            phone: string | null;
            location: string | null;
            isOpen: boolean;
            openTime: string | null;
            closeTime: string | null;
            promptpayId: string | null;
            promptpayName: string | null;
        };
        payment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            orderId: string;
            amount: number;
            method: string;
            transactionId: string | null;
            qrPayload: string | null;
            paidAt: Date | null;
        } | null;
        items: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                status: string;
                price: number;
                categoryId: string | null;
                imageUrl: string | null;
                tags: string;
                sortOrder: number;
            };
        } & {
            id: string;
            quantity: number;
            orderId: string;
            productId: string;
            unitPrice: number;
            optionsPrice: number;
            price: number;
            productName: string | null;
            customization: import("@prisma/client/runtime/library").JsonValue | null;
            selectedOptions: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
    } & {
        id: string;
        userId: string | null;
        createdAt: Date;
        updatedAt: Date;
        branchId: string;
        orderNo: string;
        customerUid: string;
        customerName: string | null;
        totalAmount: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        fulfillmentType: string;
        note: string | null;
        platform: string;
        riderName: string | null;
        riderPhone: string | null;
        qcNote: string | null;
        scheduledAt: Date | null;
        queueNo: number;
    })[]>;
    getRecentOrders(limit?: string): Promise<({
        branch: {
            address: string | null;
            id: string;
            latitude: number | null;
            longitude: number | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            imageUrl: string | null;
            phone: string | null;
            location: string | null;
            isOpen: boolean;
            openTime: string | null;
            closeTime: string | null;
            promptpayId: string | null;
            promptpayName: string | null;
        };
        payment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            orderId: string;
            amount: number;
            method: string;
            transactionId: string | null;
            qrPayload: string | null;
            paidAt: Date | null;
        } | null;
        items: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                status: string;
                price: number;
                categoryId: string | null;
                imageUrl: string | null;
                tags: string;
                sortOrder: number;
            };
        } & {
            id: string;
            quantity: number;
            orderId: string;
            productId: string;
            unitPrice: number;
            optionsPrice: number;
            price: number;
            productName: string | null;
            customization: import("@prisma/client/runtime/library").JsonValue | null;
            selectedOptions: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
    } & {
        id: string;
        userId: string | null;
        createdAt: Date;
        updatedAt: Date;
        branchId: string;
        orderNo: string;
        customerUid: string;
        customerName: string | null;
        totalAmount: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        fulfillmentType: string;
        note: string | null;
        platform: string;
        riderName: string | null;
        riderPhone: string | null;
        qcNote: string | null;
        scheduledAt: Date | null;
        queueNo: number;
    })[]>;
    getOrderStats(branchId?: string): Promise<{
        total: number;
        todayCount: number;
        todayRevenue: number;
        totalRevenue: number;
        byStatus: {
            [k: string]: number;
        };
    }>;
    getCustomerOrders(uid: string): Promise<({
        branch: {
            address: string | null;
            id: string;
            latitude: number | null;
            longitude: number | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            imageUrl: string | null;
            phone: string | null;
            location: string | null;
            isOpen: boolean;
            openTime: string | null;
            closeTime: string | null;
            promptpayId: string | null;
            promptpayName: string | null;
        };
        payment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            orderId: string;
            amount: number;
            method: string;
            transactionId: string | null;
            qrPayload: string | null;
            paidAt: Date | null;
        } | null;
        items: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                status: string;
                price: number;
                categoryId: string | null;
                imageUrl: string | null;
                tags: string;
                sortOrder: number;
            };
        } & {
            id: string;
            quantity: number;
            orderId: string;
            productId: string;
            unitPrice: number;
            optionsPrice: number;
            price: number;
            productName: string | null;
            customization: import("@prisma/client/runtime/library").JsonValue | null;
            selectedOptions: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
    } & {
        id: string;
        userId: string | null;
        createdAt: Date;
        updatedAt: Date;
        branchId: string;
        orderNo: string;
        customerUid: string;
        customerName: string | null;
        totalAmount: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        fulfillmentType: string;
        note: string | null;
        platform: string;
        riderName: string | null;
        riderPhone: string | null;
        qcNote: string | null;
        scheduledAt: Date | null;
        queueNo: number;
    })[]>;
    getOrder(id: string): Promise<{
        branch: {
            address: string | null;
            id: string;
            latitude: number | null;
            longitude: number | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            imageUrl: string | null;
            phone: string | null;
            location: string | null;
            isOpen: boolean;
            openTime: string | null;
            closeTime: string | null;
            promptpayId: string | null;
            promptpayName: string | null;
        };
        payment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            orderId: string;
            amount: number;
            method: string;
            transactionId: string | null;
            qrPayload: string | null;
            paidAt: Date | null;
        } | null;
        items: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                status: string;
                price: number;
                categoryId: string | null;
                imageUrl: string | null;
                tags: string;
                sortOrder: number;
            };
        } & {
            id: string;
            quantity: number;
            orderId: string;
            productId: string;
            unitPrice: number;
            optionsPrice: number;
            price: number;
            productName: string | null;
            customization: import("@prisma/client/runtime/library").JsonValue | null;
            selectedOptions: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
    } & {
        id: string;
        userId: string | null;
        createdAt: Date;
        updatedAt: Date;
        branchId: string;
        orderNo: string;
        customerUid: string;
        customerName: string | null;
        totalAmount: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        fulfillmentType: string;
        note: string | null;
        platform: string;
        riderName: string | null;
        riderPhone: string | null;
        qcNote: string | null;
        scheduledAt: Date | null;
        queueNo: number;
    }>;
    createOrder(orderData: Record<string, unknown>): Promise<{
        branch: {
            address: string | null;
            id: string;
            latitude: number | null;
            longitude: number | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            imageUrl: string | null;
            phone: string | null;
            location: string | null;
            isOpen: boolean;
            openTime: string | null;
            closeTime: string | null;
            promptpayId: string | null;
            promptpayName: string | null;
        };
        payment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            orderId: string;
            amount: number;
            method: string;
            transactionId: string | null;
            qrPayload: string | null;
            paidAt: Date | null;
        } | null;
        items: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                status: string;
                price: number;
                categoryId: string | null;
                imageUrl: string | null;
                tags: string;
                sortOrder: number;
            };
        } & {
            id: string;
            quantity: number;
            orderId: string;
            productId: string;
            unitPrice: number;
            optionsPrice: number;
            price: number;
            productName: string | null;
            customization: import("@prisma/client/runtime/library").JsonValue | null;
            selectedOptions: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
    } & {
        id: string;
        userId: string | null;
        createdAt: Date;
        updatedAt: Date;
        branchId: string;
        orderNo: string;
        customerUid: string;
        customerName: string | null;
        totalAmount: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        fulfillmentType: string;
        note: string | null;
        platform: string;
        riderName: string | null;
        riderPhone: string | null;
        qcNote: string | null;
        scheduledAt: Date | null;
        queueNo: number;
    }>;
    updateOrderStatus(id: string, body: Record<string, unknown>): Promise<{
        branch: {
            address: string | null;
            id: string;
            latitude: number | null;
            longitude: number | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            imageUrl: string | null;
            phone: string | null;
            location: string | null;
            isOpen: boolean;
            openTime: string | null;
            closeTime: string | null;
            promptpayId: string | null;
            promptpayName: string | null;
        };
        payment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            orderId: string;
            amount: number;
            method: string;
            transactionId: string | null;
            qrPayload: string | null;
            paidAt: Date | null;
        } | null;
        items: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                status: string;
                price: number;
                categoryId: string | null;
                imageUrl: string | null;
                tags: string;
                sortOrder: number;
            };
        } & {
            id: string;
            quantity: number;
            orderId: string;
            productId: string;
            unitPrice: number;
            optionsPrice: number;
            price: number;
            productName: string | null;
            customization: import("@prisma/client/runtime/library").JsonValue | null;
            selectedOptions: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
    } & {
        id: string;
        userId: string | null;
        createdAt: Date;
        updatedAt: Date;
        branchId: string;
        orderNo: string;
        customerUid: string;
        customerName: string | null;
        totalAmount: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        fulfillmentType: string;
        note: string | null;
        platform: string;
        riderName: string | null;
        riderPhone: string | null;
        qcNote: string | null;
        scheduledAt: Date | null;
        queueNo: number;
    }>;
    updatePayment(id: string, body: Record<string, unknown>): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PaymentStatus;
        orderId: string;
        amount: number;
        method: string;
        transactionId: string | null;
        qrPayload: string | null;
        paidAt: Date | null;
    }>;
    cancelOrder(id: string, reason?: string): Promise<{
        branch: {
            address: string | null;
            id: string;
            latitude: number | null;
            longitude: number | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            imageUrl: string | null;
            phone: string | null;
            location: string | null;
            isOpen: boolean;
            openTime: string | null;
            closeTime: string | null;
            promptpayId: string | null;
            promptpayName: string | null;
        };
        payment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            orderId: string;
            amount: number;
            method: string;
            transactionId: string | null;
            qrPayload: string | null;
            paidAt: Date | null;
        } | null;
        items: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                status: string;
                price: number;
                categoryId: string | null;
                imageUrl: string | null;
                tags: string;
                sortOrder: number;
            };
        } & {
            id: string;
            quantity: number;
            orderId: string;
            productId: string;
            unitPrice: number;
            optionsPrice: number;
            price: number;
            productName: string | null;
            customization: import("@prisma/client/runtime/library").JsonValue | null;
            selectedOptions: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
    } & {
        id: string;
        userId: string | null;
        createdAt: Date;
        updatedAt: Date;
        branchId: string;
        orderNo: string;
        customerUid: string;
        customerName: string | null;
        totalAmount: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        fulfillmentType: string;
        note: string | null;
        platform: string;
        riderName: string | null;
        riderPhone: string | null;
        qcNote: string | null;
        scheduledAt: Date | null;
        queueNo: number;
    }>;
    getGlobalStats(): Promise<{
        revenue: number;
        totalOrders: number;
        customers: number;
        branches: number;
    }>;
    getAiRecommend(prompt: string): Promise<string>;
    translate(body: {
        text: string;
        targetLanguage: 'Thai' | 'English';
    }): Promise<string>;
    getHealth(): {
        status: string;
        timestamp: string;
    };
}
