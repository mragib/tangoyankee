import { ApiProperty } from '@nestjs/swagger';

import {
  IsArray,
  IsEmpty,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumberString,
} from 'class-validator';
import { Instance } from 'src/instance/entities/instance.entity';
import { Product } from 'src/product/entities/product.entity';
import { Storage } from 'src/storage/entities/storage.entity';
import { User } from 'src/user/entities/user.entity';

export class CreateAttributeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  sellingUnitPrice: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  buyingUnitPrice: number;

  @IsEmpty()
  created_by: User;

  @ApiProperty()
  @IsNotEmptyObject()
  product: Product;

  @ApiProperty()
  @IsArray()
  instance: Instance[];

  @ApiProperty()
  @IsNotEmpty()
  storage: Storage;

  @ApiProperty()
  @IsEmpty()
  sku: string;
}
