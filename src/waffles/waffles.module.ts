import { Module } from '@nestjs/common';
import { WafflesService } from './waffles.service';
import { WafflesController } from './waffles.controller';
import { Waffle } from './entities/waffle.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Waffle])],
  controllers: [WafflesController],
  providers: [WafflesService],
})
export class WafflesModule {}
