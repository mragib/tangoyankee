import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class CreateCustomerDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(13)
  phone: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty()
  @IsOptional()
  email?: string;

  @IsEmpty()
  created_by: User;
}
