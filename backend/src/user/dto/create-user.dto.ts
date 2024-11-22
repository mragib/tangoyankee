import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from 'src/role/entities/role.entity';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsString()
  @MaxLength(50)
  username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  @Matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/, {
    message: 'Password is too weak',
  })
  password: string;

  @ApiProperty()
  @IsNotEmptyObject()
  role: Role;
}
