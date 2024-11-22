import { Chartofaccounting } from 'src/chartofaccounting/entities/chartofaccounting.entity';
import { PaymentMethodType } from 'src/common/common.enums';

import { Payment } from 'src/payments/entities/payment.entity';
import { SaleRevenue } from 'src/sale_revenue/entities/sale_revenue.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique(['name', 'account_number'])
export class Accounts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 80 })
  name: string;

  @Column({ unique: true })
  code: number;

  @Column({ nullable: true, length: 80 })
  account_number: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ nullable: true, type: 'text' })
  type: PaymentMethodType;

  @Column('decimal', { default: 0 })
  balance: number;

  // Many-to-one relation with Chartofaccounting
  @ManyToOne(() => Chartofaccounting, (chart) => chart.accounts)
  chartOfAccounting: Chartofaccounting;

  // Bi derections realtion
  @OneToMany(() => Payment, (item) => item.account)
  payment: Payment;

  @OneToMany(() => SaleRevenue, (item) => item.account)
  saleRevenue: SaleRevenue[];

  @ManyToOne(() => User, { eager: true })
  created_by: User;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, { eager: true })
  updated_by: User;

  @UpdateDateColumn()
  updated_at: Date;
}
