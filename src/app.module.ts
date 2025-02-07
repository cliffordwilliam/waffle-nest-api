import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import { envValidationSchema } from './config/env.validation';
import { WafflesModule } from './waffles/waffles.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(databaseConfig.asProvider()),
    ConfigModule.forRoot({
      validationSchema: envValidationSchema,
      load: [appConfig, databaseConfig],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    WafflesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
