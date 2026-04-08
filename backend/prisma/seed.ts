import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Create Branches
  const b1 = await prisma.branch.upsert({
    where: { id: 'branch-1' },
    update: {},
    create: {
      id: 'branch-1',
      name: '456 Coffee - Siam Square',
      location: 'Bangkok, Thailand',
    },
  });

  // 2. Create Ingredients
  const beans = await prisma.ingredient.upsert({
    where: { id: 'beans-1' },
    update: {},
    create: {
      id: 'beans-1',
      name: 'Roasted Arabica Beans',
      unit: 'g',
    },
  });

  const milk = await prisma.ingredient.upsert({
    where: { id: 'milk-1' },
    update: {},
    create: {
      id: 'milk-1',
      name: 'Fresh Whole Milk',
      unit: 'ml',
    },
  });

  // 3. Setup Inventory for Branch 1
  await prisma.inventory.upsert({
    where: { branchId_ingredientId: { branchId: b1.id, ingredientId: beans.id } },
    update: { quantity: 5000 },
    create: {
      branchId: b1.id,
      ingredientId: beans.id,
      quantity: 5000,
      lowStockThreshold: 500,
    },
  });

  await prisma.inventory.upsert({
    where: { branchId_ingredientId: { branchId: b1.id, ingredientId: milk.id } },
    update: { quantity: 10000 },
    create: {
      branchId: b1.id,
      ingredientId: milk.id,
      quantity: 10000,
      lowStockThreshold: 1000,
    },
  });

  // 4. Create Products & Recipes
  const dirtyCoffee = await prisma.product.upsert({
    where: { id: 'prod-dirty' },
    update: {},
    create: {
      id: 'prod-dirty',
      name: 'Dirty Coffee',
      price: 120,
      description: 'Cold milk with hot espresso shot.',
    },
  });

  await prisma.recipe.createMany({
    data: [
      { productId: dirtyCoffee.id, ingredientId: beans.id, quantity: 20 },
      { productId: dirtyCoffee.id, ingredientId: milk.id, quantity: 150 },
    ],
  });

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
