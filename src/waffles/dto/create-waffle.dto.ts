import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateWaffleDto {
  @ApiProperty({ description: 'The name of a waffle.' })
  @IsString()
  @MaxLength(50)
  readonly name: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  readonly description?: string;

  @IsNumber()
  @Min(0)
  readonly price: number;

  @IsBoolean()
  @IsOptional()
  readonly isGlutenFree?: boolean;

  @IsNumber()
  @Min(0)
  readonly stockQuantity: number;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  readonly flavor?: string;
}
