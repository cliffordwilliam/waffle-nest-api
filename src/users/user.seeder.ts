import { genSalt, hash } from 'bcryptjs';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { User } from './entities/user.entity';
import { Role } from './enums/role.enum';

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    console.log('Starting User Seeder...');

    // Truncate existing user data
    console.log('Truncating existing users...');
    await dataSource.query('TRUNCATE "user" RESTART IDENTITY;'); // Clear existing users
    console.log('User table truncated.');

    const repository = dataSource.getRepository(User);

    const salt = await genSalt();
    const pass = await hash('Password!123', salt);

    // Insert specific user data
    console.log('Inserting specific user data...');
    await repository.insert([
      {
        email: 'user@test.com',
        password: pass,
        role: Role.Regular,
      },
      {
        email: 'admin@test.com',
        password: pass,
        role: Role.Admin,
      },
    ]);
    console.log('Specific user data inserted.');

    console.log('user seeding completed.');
  }
}
