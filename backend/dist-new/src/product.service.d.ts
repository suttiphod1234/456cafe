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
    getProductById(id: string): Promise<{
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
    createProduct(data: CreateProductDto): Promise<{
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
    updateProduct(id: string, data: UpdateProductDto): Promise<{
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
    deleteProduct(id: string): Promise<{
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
    getAllIngredients(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        unit: string;
        costPerUnit: number;
        sku: string | null;
    }[]>;
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
}
