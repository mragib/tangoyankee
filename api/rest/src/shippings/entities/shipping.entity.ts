import { CoreEntity } from 'src/common/entities/core.entity';
import { ShippingType } from 'src/common/enums/common.enum';

export class Shipping extends CoreEntity {
  id: number;
  name: string;
  amount: number;
  is_global: boolean;
  type: ShippingType;
}
