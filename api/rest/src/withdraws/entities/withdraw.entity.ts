import { CoreEntity } from 'src/common/entities/core.entity';
import { WithdrawStatus } from 'src/common/enums/common.enum';
import { Shop } from 'src/shops/entities/shop.entity';

export class Withdraw extends CoreEntity {
  id: number;
  amount: number;
  status: WithdrawStatus;
  shop_id: number;
  shop: Shop;
  payment_method: string;
  details: string;
  note: string;
}
