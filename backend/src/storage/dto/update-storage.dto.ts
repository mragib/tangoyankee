import { PartialType, PickType } from '@nestjs/swagger';
import { CreateStorageDto } from './create-storage.dto';

export class UpdateStorageDto extends PartialType(
  PickType(CreateStorageDto, [
    'locator',
    'p_attribute',
    'quantity',
    'is_active',
  ]),
) {}
