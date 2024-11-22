import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmpty,
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
} from 'class-validator';

import { AttributeSet } from 'src/attribute-set/entities/attribute-set.entity';
import { User } from 'src/user/entities/user.entity';

export class CreateInstanceDto {
  @ApiProperty({
    description: 'all colors, sizes,brands etc',
    example: 'ksrm red',
  })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  name: string;

  @ApiProperty({ description: 'Brand, Size, Color etc' })
  @IsNotEmptyObject()
  attribute_set: AttributeSet;

  @IsEmpty()
  created_by: User;
}
