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
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        imageUrl: string | null;
        sortOrder: number;
        icon: string | null;
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
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        imageUrl: string | null;
        sortOrder: number;
        icon: string | null;
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
    reorderCategories(items: {
        id: string;
        sortOrder: number;
    }[]): Promise<({
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
    private menuInclude;
    getAllMenuItems(categoryId?: string): Promise<({
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
    getMenuItemById(id: string): Promise<{
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
    private calculateMenuCostLocal;
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
    toggleMenuStatus(id: string): Promise<{
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
    createOptionGroup(productId: string, data: {
        name: string;
        isRequired?: boolean;
        maxSelect?: number;
        sortOrder?: number;
    }): Promise<{
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
    updateOptionGroup(groupId: string, data: {
        name?: string;
        isRequired?: boolean;
        maxSelect?: number;
        sortOrder?: number;
    }): Promise<{
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
    createOption(groupId: string, data: {
        label: string;
        priceAddon?: number;
        isDefault?: boolean;
        sortOrder?: number;
    }): Promise<{
        id: string;
        label: string;
        isDefault: boolean;
        sortOrder: number;
        groupId: string;
        priceAddon: number;
    }>;
    updateOption(optionId: string, data: {
        label?: string;
        priceAddon?: number;
        isDefault?: boolean;
        sortOrder?: number;
    }): Promise<{
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
    addRecipe(productId: string, ingredientId: string, quantity: number): Promise<{
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
    updateRecipe(recipeId: string, quantity: number): Promise<{
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
    deleteRecipe(recipeId: string): Promise<{
        id: string;
        ingredientId: string;
        quantity: number;
        productId: string;
    }>;
    getAllIngredients(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
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
        createdAt: Date;
        updatedAt: Date;
        name: string;
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
        createdAt: Date;
        updatedAt: Date;
        name: string;
        unit: string;
        costPerUnit: number;
        sku: string | null;
    }>;
}
