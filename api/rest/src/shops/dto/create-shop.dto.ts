import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { UserAddress } from 'src/addresses/entities/address.entity';
import { Shop } from '../entities/shop.entity';

export class CreateShopDto extends PickType(Shop, [
  'name',
  'address',
  'description',
  'cover_image',
  'logo',
  'settings',
  'balance',
]) {
  @IsNotEmpty()
  categories: number[];
}

export class ApproveShopDto {
  id: number;
  admin_commission_rate: number;
}
