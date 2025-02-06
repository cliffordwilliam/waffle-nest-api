import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WafflesService } from './waffles.service';
import { CreateWaffleDto } from './dto/create-waffle.dto';
import { UpdateWaffleDto } from './dto/update-waffle.dto';

@Controller('waffles')
export class WafflesController {
  constructor(private readonly wafflesService: WafflesService) {}

  @Post()
  create(@Body() createWaffleDto: CreateWaffleDto) {
    return this.wafflesService.create(createWaffleDto);
  }

  @Get()
  findAll() {
    return this.wafflesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wafflesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWaffleDto: UpdateWaffleDto) {
    return this.wafflesService.update(+id, updateWaffleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wafflesService.remove(+id);
  }
}
