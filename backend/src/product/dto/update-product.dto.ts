import { User } from 'src/user/entities/user.entity';
import { CreateProductDto } from './create-product.dto';

import { PartialType, PickType } from '@nestjs/swagger';

export class UpdateProductDto extends PartialType(
  PickType(CreateProductDto, ['name', 'unit']),
) {
  updated_by?: User;
}
