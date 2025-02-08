import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWaffleDto } from './dto/create-waffle.dto';
import { UpdateWaffleDto } from './dto/update-waffle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Waffle } from './entities/waffle.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class WafflesService {
  constructor(
    @InjectRepository(Waffle)
    private readonly waffleRepository: Repository<Waffle>,
  ) {}
  create(createWaffleDto: CreateWaffleDto) {
    const waffle = this.waffleRepository.create(createWaffleDto);
    return this.waffleRepository.save(waffle);
  }

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return this.waffleRepository.find({
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: string) {
    const waffle = await this.waffleRepository.findOne({ where: { id: +id } });
    if (!waffle) {
      throw new NotFoundException(`Waffle #${id} not found`);
    }
    return waffle;
  }

  async update(id: string, updateWaffleDto: UpdateWaffleDto) {
    const waffle = await this.waffleRepository.preload({
      id: +id,
      ...updateWaffleDto,
    });
    if (!waffle) {
      throw new NotFoundException(`Waffle #${id} not found`);
    }
    return this.waffleRepository.save(waffle);
  }

  async remove(id: string) {
    const waffle = await this.findOne(id);
    return this.waffleRepository.remove(waffle);
  }
}
