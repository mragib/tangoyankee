import {
  Entity,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PaymentInfo } from './paymentInfo.entity';
import { Shop } from './shop.entity';

@Entity()
export class Balance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  admin_commission_rate: number;

  @ManyToOne(() => Shop)
  shop: Shop;

  @Column()
  total_earnings: number;

  @Column()
  withdrawn_amount: number;

  @Column()
  current_balance: number;

  @OneToOne(() => PaymentInfo)
  @JoinColumn()
  payment_info: PaymentInfo;
}
