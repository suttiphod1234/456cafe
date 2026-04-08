import { Injectable, NotFoundException } from '@nestjs/common';
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

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async getAllProducts() {
    return this.prisma.product.findMany({
      include: {
        recipes: {
          include: { ingredient: true },
        },
        _count: {
          select: { orderItems: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getProductById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        recipes: {
          include: { ingredient: true },
        },
        _count: { select: { orderItems: true } },
      },
    });
    if (!product) throw new NotFoundException(`Product ${id} not found`);
    return product;
  }

  async createProduct(data: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        categoryId: data.categoryId,
        imageUrl: data.imageUrl,
      },
      include: {
        recipes: { include: { ingredient: true } },
        _count: { select: { orderItems: true } },
      },
    });
  }

  async updateProduct(id: string, data: UpdateProductDto) {
    await this.getProductById(id);
    return this.prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        categoryId: data.categoryId,
        imageUrl: data.imageUrl,
      },
      include: {
        recipes: { include: { ingredient: true } },
        _count: { select: { orderItems: true } },
      },
    });
  }

  async deleteProduct(id: string) {
    await this.getProductById(id);
    // Delete recipes first due to FK constraints
    await this.prisma.recipe.deleteMany({ where: { productId: id } });
    return this.prisma.product.delete({ where: { id } });
  }

  // --- Recipe Management ---
  async getAllIngredients() {
    return this.prisma.ingredient.findMany({ orderBy: { name: 'asc' } });
  }

  async addRecipe(productId: string, ingredientId: string, quantity: number) {
    await this.getProductById(productId);
    return this.prisma.recipe.create({
      data: { productId, ingredientId, quantity },
      include: { ingredient: true },
    });
  }

  async updateRecipe(recipeId: string, quantity: number) {
    return this.prisma.recipe.update({
      where: { id: recipeId },
      data: { quantity },
      include: { ingredient: true },
    });
  }

  async deleteRecipe(recipeId: string) {
    return this.prisma.recipe.delete({ where: { id: recipeId } });
  }
}
