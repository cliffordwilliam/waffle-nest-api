import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
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

  // Start the NestJS app
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
