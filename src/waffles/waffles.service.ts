import { Injectable } from '@nestjs/common';
import { CreateWaffleDto } from './dto/create-waffle.dto';
import { UpdateWaffleDto } from './dto/update-waffle.dto';

@Injectable()
export class WafflesService {
  create(createWaffleDto: CreateWaffleDto) {
    return `This action adds a new waffle ${JSON.stringify(createWaffleDto)}`;
  }

  findAll() {
    return `This action returns all waffles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} waffle`;
  }

  update(id: number, updateWaffleDto: UpdateWaffleDto) {
    return `This action updates a #${id} waffle ${JSON.stringify(updateWaffleDto)}`;
  }

  remove(id: number) {
    return `This action removes a #${id} waffle`;
  }
}
