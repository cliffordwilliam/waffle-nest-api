import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import dataSource from '../typeorm-cli.config';
import { AppModule } from './app.module';

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
