import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Waffle } from './entities/waffle.entity';

export default class WaffleSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    console.log('Starting Waffle Seeder...');

    // Truncate existing waffle data
    console.log('Truncating existing waffles...');
    await dataSource.query('TRUNCATE "waffle" RESTART IDENTITY;'); // Clear existing waffles
    console.log('Waffle table truncated.');

    const repository = dataSource.getRepository(Waffle);

    // Insert specific waffle data
    console.log('Inserting specific waffle data...');
    await repository.insert([
      {
        name: 'Classic Waffle',
        description: 'A classic waffle with maple syrup and butter.',
        price: 5.99,
        isGlutenFree: false,
        stockQuantity: 20,
        flavor: 'Vanilla',
      },
      {
        name: 'Choco Delight Waffle',
        description: 'Waffle topped with chocolate sauce and whipped cream.',
        price: 7.49,
        isGlutenFree: true,
        stockQuantity: 30,
        flavor: 'Chocolate',
      },
    ]);
    console.log('Specific waffle data inserted.');

    const waffleFactory = factoryManager.get(Waffle);

    // Save 1 factory-generated waffle to the database
    console.log('Saving 1 factory-generated waffle...');
    await waffleFactory.save();
    console.log('1 factory-generated waffle saved.');

    // Save 5 factory-generated waffles to the database
    console.log('Saving 30 factory-generated waffles...');
    await waffleFactory.saveMany(30);
    console.log('30 factory-generated waffles saved.');

    console.log('Waffle seeding completed.');
  }
}
