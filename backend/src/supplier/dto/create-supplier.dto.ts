import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class CreateSupplierDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  name: string;

  @ApiProperty()
  @IsString()
  @Length(4, 200)
  address: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(5, 50)
  phone: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(5, 80)
  owner: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email: string;

  @IsEmpty()
  created_by: User;
}
