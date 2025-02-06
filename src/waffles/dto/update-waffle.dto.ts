import { PartialType } from '@nestjs/mapped-types';
import { CreateWaffleDto } from './create-waffle.dto';

export class UpdateWaffleDto extends PartialType(CreateWaffleDto) {}
