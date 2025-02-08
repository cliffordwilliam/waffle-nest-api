import { PartialType } from '@nestjs/swagger';
import { CreateWaffleDto } from './create-waffle.dto';

export class UpdateWaffleDto extends PartialType(CreateWaffleDto) {}
