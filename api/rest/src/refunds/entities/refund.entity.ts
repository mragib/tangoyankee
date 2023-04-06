import { CoreEntity } from 'src/common/entities/core.entity';
import { RefundStatus } from 'src/common/enums/common.enum';
import { Order } from 'src/orders/entities/order.entity';
import { Shop } from 'src/shops/entities/shop.entity';
import { User } from 'src/users/entities/user.entity';

export class Refund extends CoreEntity {
  amount: string;
  status: RefundStatus;
  shop: Shop;
  order: Order;
  customer: User;
}