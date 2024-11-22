import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsNumberString,
  IsOptional,
} from 'class-validator';
import { Attribute } from 'src/attribute/entities/attribute.entity';
import { Purchase } from 'src/purchase/entities/purchase.entity';

export class CreatePurchaseItemDto {
  @ApiProperty()
  @IsNotEmptyObject()
  attribute: Attribute;

  @ApiProperty()
  @IsOptional()
  purchase: Purchase;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  lot_quantity: number;

  @ApiProperty()
  @IsNumberString()
  buyingUnitPrice: number;
}
