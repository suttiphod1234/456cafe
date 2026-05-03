import { PrismaService } from './prisma.service';
export interface CreateProductDto {
    name: string;
    description?: string;
    price: number;
    categoryId?: string;
    imageUrl?: string;
}
export interface UpdateProductDto {
    name?: string;
    description?: string;
    price?: number;
    categoryId?: string;
    imageUrl?: string;
}
export declare class ProductService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllProducts(): Promise<({
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
    getProductById(id: string): Promise<{
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
    createProduct(data: CreateProductDto): Promise<{
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
    updateProduct(id: string, data: UpdateProductDto): Promise<{
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
    deleteProduct(id: string): Promise<{
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
    getAllIngredients(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        unit: string;
        costPerUnit: number;
        sku: string | null;
    }[]>;
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
}
