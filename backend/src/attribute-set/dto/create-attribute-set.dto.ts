import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmpty, IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class CreateAttributeSetDto {
  @ApiProperty({ example: 'brand color size' })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  name: string;

  @ApiProperty()
  @IsEmpty()
  created_by: User;
}
