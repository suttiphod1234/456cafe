import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive seeding...');

  // 1. Clear existing data (optional but cleaner for seed)
  // await prisma.orderItem.deleteMany();
  // await prisma.order.deleteMany();
  // await prisma.inventory.deleteMany();
  // await prisma.recipe.deleteMany();
  // await prisma.menuOption.deleteMany();
  // await prisma.menuOptionGroup.deleteMany();
  // await prisma.product.deleteMany();
  // await prisma.category.deleteMany();
  // await prisma.branchManager.deleteMany();
  // await prisma.branch.deleteMany();
  // await prisma.ingredient.deleteMany();

  // 2. Ingredients
  const coffeeBeans = await prisma.ingredient.upsert({
    where: { id: 'beans-1' }, update: {}, create: { id: 'beans-1', name: 'Premium Arabica (Roast)', unit: 'g' }
  });
  const freshMilk = await prisma.ingredient.upsert({
    where: { id: 'milk-1' }, update: {}, create: { id: 'milk-1', name: 'Fresh Milk', unit: 'ml' }
  });
  const chocolatePowder = await prisma.ingredient.upsert({
    where: { id: 'choco-1' }, update: {}, create: { id: 'choco-1', name: 'Dark Cocoa Powder', unit: 'g' }
  });

  // 3. Branches
  const branchesData = [
    { id: 'branch-1', name: '456 Coffee - Siam Square', location: '123 Rama I Rd', address: 'Siam Square Soi 3, Bangkok', latitude: 13.745, longitude: 100.530 },
    { id: 'branch-2', name: '456 Coffee - Ari', location: 'Ari Soi 1', address: 'Phahonyothin Rd, Bangkok', latitude: 13.780, longitude: 100.544 },
    { id: 'branch-3', name: '456 Coffee - Thong Lor', location: 'Sukhumvit 55', address: 'Thong Lor Soi 10, Bangkok', latitude: 13.734, longitude: 100.582 },
  ];

  for (const b of branchesData) {
    const branch = await prisma.branch.upsert({ where: { id: b.id }, update: b, create: b });
    // Setup initial inventory
    await prisma.inventory.upsert({
      where: { branchId_ingredientId: { branchId: branch.id, ingredientId: coffeeBeans.id } },
      update: {}, create: { branchId: branch.id, ingredientId: coffeeBeans.id, quantity: 5000 }
    });
    await prisma.inventory.upsert({
      where: { branchId_ingredientId: { branchId: branch.id, ingredientId: freshMilk.id } },
      update: {}, create: { branchId: branch.id, ingredientId: freshMilk.id, quantity: 10000 }
    });
  }

  // 4. Categories
  const catCoffee = await prisma.category.upsert({ where: { id: 'cat-coffee' }, update: {}, create: { id: 'cat-coffee', name: 'Coffee', icon: '☕', sortOrder: 1 } });
  const catNonCoffee = await prisma.category.upsert({ where: { id: 'cat-non' }, update: {}, create: { id: 'cat-non', name: 'Non-Coffee', icon: '🍵', sortOrder: 2 } });
  const catBakery = await prisma.category.upsert({ where: { id: 'cat-bakery' }, update: {}, create: { id: 'cat-bakery', name: 'Bakery', icon: '🥐', sortOrder: 3 } });

  // 5. Common Option Groups
  const createOptions = async (productId: string) => {
    const gSize = await prisma.menuOptionGroup.create({
      data: {
        productId, name: 'เลือกขนาด (Size)', isRequired: true, maxSelect: 1, sortOrder: 1,
        options: {
          create: [
            { label: 'S (Hot Only)', priceAddon: 0, isDefault: true, sortOrder: 1 },
            { label: 'M', priceAddon: 15, sortOrder: 2 },
            { label: 'L', priceAddon: 25, sortOrder: 3 },
          ]
        }
      }
    });

    const gSweet = await prisma.menuOptionGroup.create({
      data: {
        productId, name: 'ความหวาน (Sweetness)', isRequired: true, maxSelect: 1, sortOrder: 2,
        options: {
          create: [
            { label: '0% (No Syrup)', priceAddon: 0, sortOrder: 1 },
            { label: '50% (Less Sweet)', priceAddon: 0, sortOrder: 2 },
            { label: '100% (Normal)', priceAddon: 0, isDefault: true, sortOrder: 3 },
          ]
        }
      }
    });

    const gMilk = await prisma.menuOptionGroup.create({
      data: {
        productId, name: 'ประเภทนม (Milk)', isRequired: false, maxSelect: 1, sortOrder: 3,
        options: {
          create: [
            { label: 'Fresh Milk', priceAddon: 0, isDefault: true, sortOrder: 1 },
            { label: 'Oat Milk', priceAddon: 20, sortOrder: 2 },
            { label: 'Almond Milk', priceAddon: 20, sortOrder: 3 },
          ]
        }
      }
    });
  };

  // 6. Products
  const products = [
    { id: 'p-latte', name: 'Iced Latte', price: 85, categoryId: catCoffee.id, tags: JSON.stringify(['Bestseller']), imageUrl: 'https://images.unsplash.com/photo-1593967858208-67ddb5b4c406?auto=format&fit=crop&w=300&q=80' },
    { id: 'p-ameri', name: 'Americano', price: 75, categoryId: catCoffee.id, tags: JSON.stringify(['Recommended']), imageUrl: 'https://images.unsplash.com/photo-1551046710-23b0d9c25439?auto=format&fit=crop&w=300&q=80' },
    { id: 'p-matcha', name: 'Premium Matcha Latte', price: 95, categoryId: catNonCoffee.id, tags: JSON.stringify(['New']), imageUrl: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=300&q=80' },
    { id: 'p-croissant', name: 'Butter Croissant', price: 65, categoryId: catBakery.id, tags: JSON.stringify(['Signature']), imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=300&q=80' },
  ];

  for (const p of products) {
    const product = await prisma.product.upsert({ where: { id: p.id }, update: p, create: p });
    // Add options to beverages only
    if (p.categoryId !== catBakery.id) {
      // Clear old groups if re-running
      await prisma.menuOption.deleteMany({ where: { group: { productId: p.id } } });
      await prisma.menuOptionGroup.deleteMany({ where: { productId: p.id } });
      await createOptions(p.id);
    }
  }

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
