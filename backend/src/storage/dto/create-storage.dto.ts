import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
} from 'class-validator';
import { Attribute } from 'src/attribute/entities/attribute.entity';
import { Locator } from 'src/locator/entities/locator.entity';

export class CreateStorageDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNotEmptyObject()
  locator: Locator;

  @ApiProperty()
  @IsNotEmptyObject()
  p_attribute: Attribute;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  lot_quantity: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  is_active: boolean;
}
