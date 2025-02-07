import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { Waffle } from './waffles/entities/waffle.entity';
import { CreateWaffleTable1738959238260 } from './migrations/1738959238260-CreateWaffleTable';

config(); // Load environment variables

async function bootstrap() {
  // Create NestJS app
  const app = await NestFactory.create(AppModule);

  // Initialize Validation Pipe for DTO validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Initialize TypeORM DataSource for migrations
  const dataSource = new DataSource({
    type: process.env.DATABASE_TYPE || 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT) || 5432,
    username: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME || 'test',
    entities: [Waffle],
    migrations: [CreateWaffleTable1738959238260],
    logging: true, // Enable logging
    logger: 'advanced-console', // Advanced console logger (logs to console)
  } as DataSourceOptions);

  // Run migrations before starting the app
  try {
    await dataSource.initialize();
    console.log('Database connected! Running migrations...');
    await dataSource.runMigrations();
    console.log('Migrations complete!');
    await dataSource.destroy();
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1); // Exit if migrations fail
  }

  // Start the NestJS app
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
