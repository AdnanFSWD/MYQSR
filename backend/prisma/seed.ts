/// <reference types="node" />
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const seedData = [
  {
    category: 'Breakfast',
    code: 'BREAKFAST',
    displayOrder: 1,
    items: [
      { name: 'Dosa', price: 40.00, image: 'dosa.jpg', displayOrder: 1, shortCode: 'DOSA', code: 'DOSA' },
      { name: 'Bonda', price: 30.00, image: 'bonda.jpg', displayOrder: 2, shortCode: 'BND', code: 'BONDA' },
      { name: 'Onion Bonda', price: 35.00, image: 'onion-bonda.jpg', displayOrder: 3, shortCode: 'OBND', code: 'ONION_BONDA' },
      { name: 'Vada', price: 35.00, image: 'vada.jpg', displayOrder: 4, shortCode: 'VADA', code: 'VADA' },
      { name: 'Mirchi Bajji', price: 30.00, image: 'mirchi-bajji.jpg', displayOrder: 5, shortCode: 'MBJ', code: 'MIRCHI_BAJJI' },
      { name: 'Aloo Bajji', price: 30.00, image: 'aloo-bajji.jpg', displayOrder: 6, shortCode: 'ABJ', code: 'ALOO_BAJJI' },
      { name: 'Punugulu', price: 30.00, image: 'punugulu.jpg', displayOrder: 7, shortCode: 'PNG', code: 'PUNUGULU' },
      { name: 'Idli', price: 30.00, image: 'idli.jpg', displayOrder: 8, shortCode: 'IDLI', code: 'IDLI' },
    ],
  },
  {
    category: 'Snacks',
    code: 'SNACKS',
    displayOrder: 2,
    items: [
      { name: 'Egg Samosa', price: 15.00, image: 'egg-samosa.jpg', displayOrder: 1, shortCode: 'ESAM', code: 'SAM-EGG' },
      { name: 'Aloo Samosa', price: 12.00, image: 'aloo-samosa.jpg', displayOrder: 2, shortCode: 'ASAM', code: 'ALOO_SAMOSA' },
      { name: 'Onion Samosa', price: 10.00, image: 'onion-samosa.jpg', displayOrder: 3, shortCode: 'OSAM', code: 'ONION_SAMOSA' },
      { name: 'Paneer Samosa', price: 20.00, image: 'paneer-samosa.jpg', displayOrder: 4, shortCode: 'PSAM', code: 'PANEER_SAMOSA' },
      { name: 'Corn Samosa', price: 15.00, image: 'corn-samosa.jpg', displayOrder: 5, shortCode: 'CSAM', code: 'CORN_SAMOSA' },
      { name: 'Egg Patties', price: 20.00, image: 'egg-patties.jpg', displayOrder: 6, shortCode: 'EPAT', code: 'PAT-EGG' },
      { name: 'Veg Patties', price: 15.00, image: 'veg-patties.jpg', displayOrder: 7, shortCode: 'VPAT', code: 'VEG_PATTIES' },
      { name: 'Paneer Patties', price: 25.00, image: 'paneer-patties.jpg', displayOrder: 8, shortCode: 'PPAT', code: 'PANEER_PATTIES' },
    ],
  },
  {
    category: 'Tea',
    code: 'TEA',
    displayOrder: 3,
    items: [
      { name: 'Normal Tea', price: 10.00, image: 'normal-tea.jpg', displayOrder: 1, shortCode: 'NTEA', code: 'NORMAL_TEA' },
      { name: 'Ginger Tea', price: 12.00, image: 'ginger-tea.jpg', displayOrder: 2, shortCode: 'GTEA', code: 'GINGER_TEA' },
    ],
  },
];

async function main() {
  console.log('Starting database seeding...');

  for (const group of seedData) {
    console.log(`Upserting category: ${group.category} (code: ${group.code})`);

    // Upsert the Category
    const category = await prisma.category.upsert({
      where: { code: group.code },
      update: {
        name: group.category,
        displayOrder: group.displayOrder,
      },
      create: {
        code: group.code,
        name: group.category,
        displayOrder: group.displayOrder,
      },
    });

    for (const item of group.items) {
      console.log(`  Upserting menu item: ${item.name} (${item.code})`);

      // Upsert the MenuItem under this Category using code as the identifier
      await prisma.menuItem.upsert({
        where: { code: item.code },
        update: {
          name: item.name,
          shortCode: item.shortCode,
          price: item.price,
          image: item.image,
          displayOrder: item.displayOrder,
          categoryId: category.id,
        },
        create: {
          code: item.code,
          name: item.name,
          shortCode: item.shortCode,
          price: item.price,
          image: item.image,
          displayOrder: item.displayOrder,
          categoryId: category.id,
        },
      });
    }
  }

  console.log('Seeding database completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error seeding database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
