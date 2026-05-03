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
        managers: {
            id: string;
            name: string;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            branchId: string;
            email: string | null;
            role: string;
            lineUid: string | null;
        }[];
        _count: {
            orders: number;
            inventory: number;
        };
    } & {
        id: string;
        name: string;
        location: string | null;
        address: string | null;
        latitude: number | null;
        longitude: number | null;
        isOpen: boolean;
        openTime: string | null;
        closeTime: string | null;
        phone: string | null;
        promptpayId: string | null;
        promptpayName: string | null;
        imageUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getBranch(id: string): Promise<{
        managers: {
            id: string;
            name: string;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            branchId: string;
            email: string | null;
            role: string;
            lineUid: string | null;
        }[];
        _count: {
            orders: number;
            inventory: number;
        };
    } & {
        id: string;
        name: string;
        location: string | null;
        address: string | null;
        latitude: number | null;
        longitude: number | null;
        isOpen: boolean;
        openTime: string | null;
        closeTime: string | null;
        phone: string | null;
        promptpayId: string | null;
        promptpayName: string | null;
        imageUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createBranch(body: Record<string, unknown>): Promise<{
        managers: {
            id: string;
            name: string;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            branchId: string;
            email: string | null;
            role: string;
            lineUid: string | null;
        }[];
        _count: {
            orders: number;
            inventory: number;
        };
    } & {
        id: string;
        name: string;
        location: string | null;
        address: string | null;
        latitude: number | null;
        longitude: number | null;
        isOpen: boolean;
        openTime: string | null;
        closeTime: string | null;
        phone: string | null;
        promptpayId: string | null;
        promptpayName: string | null;
        imageUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateBranch(id: string, body: Record<string, unknown>): Promise<{
        managers: {
            id: string;
            name: string;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            branchId: string;
            email: string | null;
            role: string;
            lineUid: string | null;
        }[];
        _count: {
            orders: number;
            inventory: number;
        };
    } & {
        id: string;
        name: string;
        location: string | null;
        address: string | null;
        latitude: number | null;
        longitude: number | null;
        isOpen: boolean;
        openTime: string | null;
        closeTime: string | null;
        phone: string | null;
        promptpayId: string | null;
        promptpayName: string | null;
        imageUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteBranch(id: string): Promise<{
        id: string;
        name: string;
        location: string | null;
        address: string | null;
        latitude: number | null;
        longitude: number | null;
        isOpen: boolean;
        openTime: string | null;
        closeTime: string | null;
        phone: string | null;
        promptpayId: string | null;
        promptpayName: string | null;
        imageUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    toggleBranchOpen(id: string): Promise<{
        managers: {
            id: string;
            name: string;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            branchId: string;
            email: string | null;
            role: string;
            lineUid: string | null;
        }[];
        _count: {
            orders: number;
            inventory: number;
        };
    } & {
        id: string;
        name: string;
        location: string | null;
        address: string | null;
        latitude: number | null;
        longitude: number | null;
        isOpen: boolean;
        openTime: string | null;
        closeTime: string | null;
        phone: string | null;
        promptpayId: string | null;
        promptpayName: string | null;
        imageUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
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
                    name: string;
                    imageUrl: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    description: string | null;
                    sortOrder: number;
                    tags: string;
                    price: number;
                    categoryId: string | null;
                    status: string;
                };
            } & {
                id: string;
                price: number;
                productId: string;
                quantity: number;
                orderId: string;
                unitPrice: number;
                optionsPrice: number;
                productName: string | null;
                customization: import("@prisma/client/runtime/library").JsonValue | null;
                selectedOptions: import("@prisma/client/runtime/library").JsonValue | null;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.OrderStatus;
            userId: string | null;
            branchId: string;
            orderNo: string;
            customerUid: string;
            customerName: string | null;
            totalAmount: number;
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
                name: string;
                imageUrl: string | null;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                sortOrder: number;
                tags: string;
                price: number;
                categoryId: string | null;
                status: string;
            };
        } & {
            id: string;
            price: number;
            productId: string;
            quantity: number;
            orderId: string;
            unitPrice: number;
            optionsPrice: number;
            productName: string | null;
            customization: import("@prisma/client/runtime/library").JsonValue | null;
            selectedOptions: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        userId: string | null;
        branchId: string;
        orderNo: string;
        customerUid: string;
        customerName: string | null;
        totalAmount: number;
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
            name: string;
            createdAt: Date;
            updatedAt: Date;
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
            name: string;
            createdAt: Date;
            updatedAt: Date;
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
        name: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        branchId: string;
        email: string | null;
        role: string;
        lineUid: string | null;
    }[]>;
    addManager(id: string, body: Record<string, unknown>): Promise<{
        id: string;
        name: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        branchId: string;
        email: string | null;
        role: string;
        lineUid: string | null;
    }>;
    updateManager(managerId: string, body: Record<string, unknown>): Promise<{
        id: string;
        name: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        branchId: string;
        email: string | null;
        role: string;
        lineUid: string | null;
    }>;
    deleteManager(managerId: string): Promise<{
        id: string;
        name: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        branchId: string;
        email: string | null;
        role: string;
        lineUid: string | null;
    }>;
    getProducts(): Promise<({
        category: {
            id: string;
            name: string;
            imageUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            icon: string | null;
            sortOrder: number;
            isVisible: boolean;
        } | null;
        optionGroups: ({
            options: {
                id: string;
                sortOrder: number;
                label: string;
                priceAddon: number;
                isDefault: boolean;
                groupId: string;
            }[];
        } & {
            id: string;
            name: string;
            sortOrder: number;
            productId: string;
            isRequired: boolean;
            maxSelect: number;
        })[];
        recipes: ({
            ingredient: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                unit: string;
                costPerUnit: number;
                sku: string | null;
            };
        } & {
            id: string;
            productId: string;
            ingredientId: string;
            quantity: number;
        })[];
        _count: {
            orderItems: number;
        };
    } & {
        id: string;
        name: string;
        imageUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        sortOrder: number;
        tags: string;
        price: number;
        categoryId: string | null;
        status: string;
    })[]>;
    getIngredients(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        unit: string;
        costPerUnit: number;
        sku: string | null;
    }[]>;
    createIngredient(body: Record<string, unknown>): Promise<any>;
    updateIngredient(id: string, body: Record<string, unknown>): Promise<any>;
    getProduct(id: string): Promise<{
        category: {
            id: string;
            name: string;
            imageUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            icon: string | null;
            sortOrder: number;
            isVisible: boolean;
        } | null;
        optionGroups: ({
            options: {
                id: string;
                sortOrder: number;
                label: string;
                priceAddon: number;
                isDefault: boolean;
                groupId: string;
            }[];
        } & {
            id: string;
            name: string;
            sortOrder: number;
            productId: string;
            isRequired: boolean;
            maxSelect: number;
        })[];
        recipes: ({
            ingredient: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                unit: string;
                costPerUnit: number;
                sku: string | null;
            };
        } & {
            id: string;
            productId: string;
            ingredientId: string;
            quantity: number;
        })[];
        _count: {
            orderItems: number;
        };
    } & {
        id: string;
        name: string;
        imageUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        sortOrder: number;
        tags: string;
        price: number;
        categoryId: string | null;
        status: string;
    }>;
    addRecipeLegacy(id: string, body: {
        ingredientId: string;
        quantity: number;
    }): Promise<{
        ingredient: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            unit: string;
            costPerUnit: number;
            sku: string | null;
        };
    } & {
        id: string;
        productId: string;
        ingredientId: string;
        quantity: number;
    }>;
    updateRecipeLegacy(recipeId: string, quantity: number): Promise<{
        ingredient: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            unit: string;
            costPerUnit: number;
            sku: string | null;
        };
    } & {
        id: string;
        productId: string;
        ingredientId: string;
        quantity: number;
    }>;
    deleteRecipeLegacy(recipeId: string): Promise<{
        id: string;
        productId: string;
        ingredientId: string;
        quantity: number;
    }>;
    getCategories(): Promise<({
        _count: {
            products: number;
        };
    } & {
        id: string;
        name: string;
        imageUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        icon: string | null;
        sortOrder: number;
        isVisible: boolean;
    })[]>;
    createCategory(body: Record<string, unknown>): Promise<{
        _count: {
            products: number;
        };
    } & {
        id: string;
        name: string;
        imageUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        icon: string | null;
        sortOrder: number;
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
        name: string;
        imageUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        icon: string | null;
        sortOrder: number;
        isVisible: boolean;
    })[]>;
    updateCategory(id: string, body: Record<string, unknown>): Promise<{
        _count: {
            products: number;
        };
    } & {
        id: string;
        name: string;
        imageUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        icon: string | null;
        sortOrder: number;
        isVisible: boolean;
    }>;
    deleteCategory(id: string): Promise<{
        id: string;
        name: string;
        imageUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        icon: string | null;
        sortOrder: number;
        isVisible: boolean;
    }>;
    getMenu(categoryId?: string): Promise<({
        category: {
            id: string;
            name: string;
            imageUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            icon: string | null;
            sortOrder: number;
            isVisible: boolean;
        } | null;
        optionGroups: ({
            options: {
                id: string;
                sortOrder: number;
                label: string;
                priceAddon: number;
                isDefault: boolean;
                groupId: string;
            }[];
        } & {
            id: string;
            name: string;
            sortOrder: number;
            productId: string;
            isRequired: boolean;
            maxSelect: number;
        })[];
        recipes: ({
            ingredient: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                unit: string;
                costPerUnit: number;
                sku: string | null;
            };
        } & {
            id: string;
            productId: string;
            ingredientId: string;
            quantity: number;
        })[];
        _count: {
            orderItems: number;
        };
    } & {
        id: string;
        name: string;
        imageUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        sortOrder: number;
        tags: string;
        price: number;
        categoryId: string | null;
        status: string;
    })[]>;
    getMenuIngredients(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
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
            name: string;
            imageUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            icon: string | null;
            sortOrder: number;
            isVisible: boolean;
        } | null;
        recipes: ({
            ingredient: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                unit: string;
                costPerUnit: number;
                sku: string | null;
            };
        } & {
            id: string;
            productId: string;
            ingredientId: string;
            quantity: number;
        })[];
        id: string;
        name: string;
        imageUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        sortOrder: number;
        tags: string;
        price: number;
        categoryId: string | null;
        status: string;
    }[]>;
    getMenuItem(id: string): Promise<{
        category: {
            id: string;
            name: string;
            imageUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            icon: string | null;
            sortOrder: number;
            isVisible: boolean;
        } | null;
        optionGroups: ({
            options: {
                id: string;
                sortOrder: number;
                label: string;
                priceAddon: number;
                isDefault: boolean;
                groupId: string;
            }[];
        } & {
            id: string;
            name: string;
            sortOrder: number;
            productId: string;
            isRequired: boolean;
            maxSelect: number;
        })[];
        recipes: ({
            ingredient: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                unit: string;
                costPerUnit: number;
                sku: string | null;
            };
        } & {
            id: string;
            productId: string;
            ingredientId: string;
            quantity: number;
        })[];
        _count: {
            orderItems: number;
        };
    } & {
        id: string;
        name: string;
        imageUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        sortOrder: number;
        tags: string;
        price: number;
        categoryId: string | null;
        status: string;
    }>;
    createMenuItem(body: Record<string, unknown>): Promise<{
        category: {
            id: string;
            name: string;
            imageUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            icon: string | null;
            sortOrder: number;
            isVisible: boolean;
        } | null;
        optionGroups: ({
            options: {
                id: string;
                sortOrder: number;
                label: string;
                priceAddon: number;
                isDefault: boolean;
                groupId: string;
            }[];
        } & {
            id: string;
            name: string;
            sortOrder: number;
            productId: string;
            isRequired: boolean;
            maxSelect: number;
        })[];
        recipes: ({
            ingredient: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                unit: string;
                costPerUnit: number;
                sku: string | null;
            };
        } & {
            id: string;
            productId: string;
            ingredientId: string;
            quantity: number;
        })[];
        _count: {
            orderItems: number;
        };
    } & {
        id: string;
        name: string;
        imageUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        sortOrder: number;
        tags: string;
        price: number;
        categoryId: string | null;
        status: string;
    }>;
    updateMenuItem(id: string, body: Record<string, unknown>): Promise<{
        category: {
            id: string;
            name: string;
            imageUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            icon: string | null;
            sortOrder: number;
            isVisible: boolean;
        } | null;
        optionGroups: ({
            options: {
                id: string;
                sortOrder: number;
                label: string;
                priceAddon: number;
                isDefault: boolean;
                groupId: string;
            }[];
        } & {
            id: string;
            name: string;
            sortOrder: number;
            productId: string;
            isRequired: boolean;
            maxSelect: number;
        })[];
        recipes: ({
            ingredient: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                unit: string;
                costPerUnit: number;
                sku: string | null;
            };
        } & {
            id: string;
            productId: string;
            ingredientId: string;
            quantity: number;
        })[];
        _count: {
            orderItems: number;
        };
    } & {
        id: string;
        name: string;
        imageUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        sortOrder: number;
        tags: string;
        price: number;
        categoryId: string | null;
        status: string;
    }>;
    deleteMenuItem(id: string): Promise<{
        id: string;
        name: string;
        imageUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        sortOrder: number;
        tags: string;
        price: number;
        categoryId: string | null;
        status: string;
    }>;
    setMenuStatus(id: string, status: string): Promise<{
        category: {
            id: string;
            name: string;
            imageUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            icon: string | null;
            sortOrder: number;
            isVisible: boolean;
        } | null;
        optionGroups: ({
            options: {
                id: string;
                sortOrder: number;
                label: string;
                priceAddon: number;
                isDefault: boolean;
                groupId: string;
            }[];
        } & {
            id: string;
            name: string;
            sortOrder: number;
            productId: string;
            isRequired: boolean;
            maxSelect: number;
        })[];
        recipes: ({
            ingredient: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                unit: string;
                costPerUnit: number;
                sku: string | null;
            };
        } & {
            id: string;
            productId: string;
            ingredientId: string;
            quantity: number;
        })[];
        _count: {
            orderItems: number;
        };
    } & {
        id: string;
        name: string;
        imageUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        sortOrder: number;
        tags: string;
        price: number;
        categoryId: string | null;
        status: string;
    }>;
    addMenuRecipe(id: string, body: {
        ingredientId: string;
        quantity: number;
    }): Promise<{
        ingredient: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            unit: string;
            costPerUnit: number;
            sku: string | null;
        };
    } & {
        id: string;
        productId: string;
        ingredientId: string;
        quantity: number;
    }>;
    createOptionGroup(id: string, body: Record<string, unknown>): Promise<{
        options: {
            id: string;
            sortOrder: number;
            label: string;
            priceAddon: number;
            isDefault: boolean;
            groupId: string;
        }[];
    } & {
        id: string;
        name: string;
        sortOrder: number;
        productId: string;
        isRequired: boolean;
        maxSelect: number;
    }>;
    updateOptionGroup(groupId: string, body: Record<string, unknown>): Promise<{
        options: {
            id: string;
            sortOrder: number;
            label: string;
            priceAddon: number;
            isDefault: boolean;
            groupId: string;
        }[];
    } & {
        id: string;
        name: string;
        sortOrder: number;
        productId: string;
        isRequired: boolean;
        maxSelect: number;
    }>;
    deleteOptionGroup(groupId: string): Promise<{
        id: string;
        name: string;
        sortOrder: number;
        productId: string;
        isRequired: boolean;
        maxSelect: number;
    }>;
    createOption(groupId: string, body: Record<string, unknown>): Promise<{
        id: string;
        sortOrder: number;
        label: string;
        priceAddon: number;
        isDefault: boolean;
        groupId: string;
    }>;
    updateOption(optionId: string, body: Record<string, unknown>): Promise<{
        id: string;
        sortOrder: number;
        label: string;
        priceAddon: number;
        isDefault: boolean;
        groupId: string;
    }>;
    deleteOption(optionId: string): Promise<{
        id: string;
        sortOrder: number;
        label: string;
        priceAddon: number;
        isDefault: boolean;
        groupId: string;
    }>;
    getOrders(branchId?: string, status?: string, date?: string, search?: string): Promise<({
        branch: {
            id: string;
            name: string;
            location: string | null;
            address: string | null;
            latitude: number | null;
            longitude: number | null;
            isOpen: boolean;
            openTime: string | null;
            closeTime: string | null;
            phone: string | null;
            promptpayId: string | null;
            promptpayName: string | null;
            imageUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
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
                name: string;
                imageUrl: string | null;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                sortOrder: number;
                tags: string;
                price: number;
                categoryId: string | null;
                status: string;
            };
        } & {
            id: string;
            price: number;
            productId: string;
            quantity: number;
            orderId: string;
            unitPrice: number;
            optionsPrice: number;
            productName: string | null;
            customization: import("@prisma/client/runtime/library").JsonValue | null;
            selectedOptions: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        userId: string | null;
        branchId: string;
        orderNo: string;
        customerUid: string;
        customerName: string | null;
        totalAmount: number;
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
            id: string;
            name: string;
            location: string | null;
            address: string | null;
            latitude: number | null;
            longitude: number | null;
            isOpen: boolean;
            openTime: string | null;
            closeTime: string | null;
            phone: string | null;
            promptpayId: string | null;
            promptpayName: string | null;
            imageUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
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
                name: string;
                imageUrl: string | null;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                sortOrder: number;
                tags: string;
                price: number;
                categoryId: string | null;
                status: string;
            };
        } & {
            id: string;
            price: number;
            productId: string;
            quantity: number;
            orderId: string;
            unitPrice: number;
            optionsPrice: number;
            productName: string | null;
            customization: import("@prisma/client/runtime/library").JsonValue | null;
            selectedOptions: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        userId: string | null;
        branchId: string;
        orderNo: string;
        customerUid: string;
        customerName: string | null;
        totalAmount: number;
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
            id: string;
            name: string;
            location: string | null;
            address: string | null;
            latitude: number | null;
            longitude: number | null;
            isOpen: boolean;
            openTime: string | null;
            closeTime: string | null;
            phone: string | null;
            promptpayId: string | null;
            promptpayName: string | null;
            imageUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
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
                name: string;
                imageUrl: string | null;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                sortOrder: number;
                tags: string;
                price: number;
                categoryId: string | null;
                status: string;
            };
        } & {
            id: string;
            price: number;
            productId: string;
            quantity: number;
            orderId: string;
            unitPrice: number;
            optionsPrice: number;
            productName: string | null;
            customization: import("@prisma/client/runtime/library").JsonValue | null;
            selectedOptions: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        userId: string | null;
        branchId: string;
        orderNo: string;
        customerUid: string;
        customerName: string | null;
        totalAmount: number;
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
            id: string;
            name: string;
            location: string | null;
            address: string | null;
            latitude: number | null;
            longitude: number | null;
            isOpen: boolean;
            openTime: string | null;
            closeTime: string | null;
            phone: string | null;
            promptpayId: string | null;
            promptpayName: string | null;
            imageUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
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
                name: string;
                imageUrl: string | null;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                sortOrder: number;
                tags: string;
                price: number;
                categoryId: string | null;
                status: string;
            };
        } & {
            id: string;
            price: number;
            productId: string;
            quantity: number;
            orderId: string;
            unitPrice: number;
            optionsPrice: number;
            productName: string | null;
            customization: import("@prisma/client/runtime/library").JsonValue | null;
            selectedOptions: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        userId: string | null;
        branchId: string;
        orderNo: string;
        customerUid: string;
        customerName: string | null;
        totalAmount: number;
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
            id: string;
            name: string;
            location: string | null;
            address: string | null;
            latitude: number | null;
            longitude: number | null;
            isOpen: boolean;
            openTime: string | null;
            closeTime: string | null;
            phone: string | null;
            promptpayId: string | null;
            promptpayName: string | null;
            imageUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
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
                name: string;
                imageUrl: string | null;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                sortOrder: number;
                tags: string;
                price: number;
                categoryId: string | null;
                status: string;
            };
        } & {
            id: string;
            price: number;
            productId: string;
            quantity: number;
            orderId: string;
            unitPrice: number;
            optionsPrice: number;
            productName: string | null;
            customization: import("@prisma/client/runtime/library").JsonValue | null;
            selectedOptions: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        userId: string | null;
        branchId: string;
        orderNo: string;
        customerUid: string;
        customerName: string | null;
        totalAmount: number;
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
            id: string;
            name: string;
            location: string | null;
            address: string | null;
            latitude: number | null;
            longitude: number | null;
            isOpen: boolean;
            openTime: string | null;
            closeTime: string | null;
            phone: string | null;
            promptpayId: string | null;
            promptpayName: string | null;
            imageUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
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
                name: string;
                imageUrl: string | null;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                sortOrder: number;
                tags: string;
                price: number;
                categoryId: string | null;
                status: string;
            };
        } & {
            id: string;
            price: number;
            productId: string;
            quantity: number;
            orderId: string;
            unitPrice: number;
            optionsPrice: number;
            productName: string | null;
            customization: import("@prisma/client/runtime/library").JsonValue | null;
            selectedOptions: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        userId: string | null;
        branchId: string;
        orderNo: string;
        customerUid: string;
        customerName: string | null;
        totalAmount: number;
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
            id: string;
            name: string;
            location: string | null;
            address: string | null;
            latitude: number | null;
            longitude: number | null;
            isOpen: boolean;
            openTime: string | null;
            closeTime: string | null;
            phone: string | null;
            promptpayId: string | null;
            promptpayName: string | null;
            imageUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
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
                name: string;
                imageUrl: string | null;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                sortOrder: number;
                tags: string;
                price: number;
                categoryId: string | null;
                status: string;
            };
        } & {
            id: string;
            price: number;
            productId: string;
            quantity: number;
            orderId: string;
            unitPrice: number;
            optionsPrice: number;
            productName: string | null;
            customization: import("@prisma/client/runtime/library").JsonValue | null;
            selectedOptions: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        userId: string | null;
        branchId: string;
        orderNo: string;
        customerUid: string;
        customerName: string | null;
        totalAmount: number;
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
