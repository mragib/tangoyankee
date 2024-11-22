import { PartialType, PickType } from '@nestjs/swagger';

import { CreateAttributeDto } from './create-attribute.dto';
import { IsEmpty } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class UpdateAttributeDto extends PartialType(
  PickType(CreateAttributeDto, [
    'sellingUnitPrice',
    'product',
    'instance',
    'buyingUnitPrice',
  ]),
) {
  @IsEmpty()
  updated_by: User;
}
