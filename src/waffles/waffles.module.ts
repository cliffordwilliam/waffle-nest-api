import { Module } from '@nestjs/common';
import { WafflesService } from './waffles.service';
import { WafflesController } from './waffles.controller';

@Module({
  controllers: [WafflesController],
  providers: [WafflesService],
})
export class WafflesModule {}
