import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Testing Branch Creation...');
  const branch = await prisma.branch.create({
    data: {
      name: 'Test Branch 456',
      address: '123 Test Street, BKK',
      phone: '081-234-5678',
      promptpayId: '0812345678',
      promptpayName: 'Mr. Test Branch',
      imageUrl: 'https://example.com/shop.jpg'
    }
  });
  console.log('Created branch:', branch);

  console.log('\nTesting Branch Retrieval...');
  const fetched = await prisma.branch.findUnique({
    where: { id: branch.id }
  });
  console.log('Fetched branch:', fetched);

  console.log('\nCleaning up...');
  await prisma.branch.delete({
    where: { id: branch.id }
  });
  console.log('Cleanup successful.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
