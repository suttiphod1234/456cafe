import { PrismaService } from './prisma.service';
export declare class MenuService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllCategories(): Promise<({
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
    createCategory(data: {
        name: string;
        description?: string;
        icon?: string;
        imageUrl?: string;
        sortOrder?: number;
        isVisible?: boolean;
    }): Promise<{
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
    updateCategory(id: string, data: {
        name?: string;
        description?: string;
        icon?: string;
        imageUrl?: string;
        sortOrder?: number;
        isVisible?: boolean;
    }): Promise<{
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
    reorderCategories(items: {
        id: string;
        sortOrder: number;
    }[]): Promise<({
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
    private menuInclude;
    getAllMenuItems(categoryId?: string): Promise<({
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
    getMenuItemById(id: string): Promise<{
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
    private calculateMenuCostLocal;
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
    createMenuItem(data: {
        name: string;
        description?: string;
        price: number;
        categoryId?: string;
        imageUrl?: string;
        status?: string;
        tags?: string[];
        sortOrder?: number;
    }): Promise<{
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
    updateMenuItem(id: string, data: {
        name?: string;
        description?: string;
        price?: number;
        categoryId?: string;
        imageUrl?: string;
        status?: string;
        tags?: string[];
        sortOrder?: number;
    }): Promise<{
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
    toggleMenuStatus(id: string): Promise<{
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
    createOptionGroup(productId: string, data: {
        name: string;
        isRequired?: boolean;
        maxSelect?: number;
        sortOrder?: number;
    }): Promise<{
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
    updateOptionGroup(groupId: string, data: {
        name?: string;
        isRequired?: boolean;
        maxSelect?: number;
        sortOrder?: number;
    }): Promise<{
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
    createOption(groupId: string, data: {
        label: string;
        priceAddon?: number;
        isDefault?: boolean;
        sortOrder?: number;
    }): Promise<{
        id: string;
        sortOrder: number;
        label: string;
        priceAddon: number;
        isDefault: boolean;
        groupId: string;
    }>;
    updateOption(optionId: string, data: {
        label?: string;
        priceAddon?: number;
        isDefault?: boolean;
        sortOrder?: number;
    }): Promise<{
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
    addRecipe(productId: string, ingredientId: string, quantity: number): Promise<{
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
    updateRecipe(recipeId: string, quantity: number): Promise<{
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
    deleteRecipe(recipeId: string): Promise<{
        id: string;
        productId: string;
        ingredientId: string;
        quantity: number;
    }>;
    getAllIngredients(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        unit: string;
        costPerUnit: number;
        sku: string | null;
    }[]>;
    createIngredient(data: {
        name: string;
        unit: string;
        costPerUnit?: number;
        sku?: string;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        unit: string;
        costPerUnit: number;
        sku: string | null;
    }>;
    updateIngredient(id: string, data: {
        name?: string;
        unit?: string;
        costPerUnit?: number;
        sku?: string;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        unit: string;
        costPerUnit: number;
        sku: string | null;
    }>;
}
