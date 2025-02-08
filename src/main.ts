import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  // swagger api doc
  const options = new DocumentBuilder()
    .setTitle('waffle-nest-api')
    .setDescription(
      'A NestJS-powered back-end with authentication, PostgreSQL, TypeORM, and Redis. Built to showcase scalable API design and back-end architecture.',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swag', app, document); // open browser thisAppDomain/api e.g. localhost:3000/api

  // Start the NestJS app
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
