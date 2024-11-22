import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmpty, IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class CreateProductDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  @IsString()
  unit: string;

  @IsEmpty()
  created_by: User;
}
