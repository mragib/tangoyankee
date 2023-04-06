import { PickType } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsLowercase,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CreateAddressDto } from 'src/addresses/dto/create-address.dto';
import { Shop } from 'src/shops/entities/shop.entity';
import { User } from '../entities/user.entity';
import { CreateProfileDto } from './create-profile.dto';

enum Permission {
  SUPER_ADMIN = 'Super admin',
  STORE_OWNER = 'Store owner',
  STAFF = 'Staff',
  CUSTOMER = 'Customer',
}
export class CreateUserDto extends PickType(User, [
  'name',
  'email',
  'password',
]) {
  @IsString()
  @IsLowercase()
  @MaxLength(50)
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  shop_id: number;

  @IsArray()
  @IsOptional()
  shop: Shop[];

  @IsOptional()
  managed_shop: Shop;

  address: CreateAddressDto[];
  profile: CreateProfileDto;
  permission: Permission = Permission.CUSTOMER;
}
