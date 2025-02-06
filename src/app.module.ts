import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerModule } from '@nestjs/throttler';
import { WafflesModule } from './waffles/waffles.module';

@Module({
  imports: [
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
