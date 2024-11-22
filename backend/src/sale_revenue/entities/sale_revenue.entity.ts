import { Accounts } from 'src/accounts/entities/accounts.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { Sale } from 'src/sales/entities/sale.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  TreeChildren,
  TreeParent,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class SaleRevenue {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Sale, (item) => item.saleRevenue, { onDelete: 'CASCADE' })
  sale: Sale;

  @Column()
  saleId: number;

  @ManyToOne(() => Customer, (item) => item.saleRevenue)
  customer: Customer;

  @Column()
  customerId: number;

  @ManyToOne(() => Accounts, (item) => item.saleRevenue, {
    eager: true,
  })
  account: Accounts;

  @Column()
  paymentDate: Date;

  @Column('double')
  amountPaid: number;

  @Column({ nullable: true })
  cheque_number: string;

  @TreeParent()
  parent: SaleRevenue;

  @TreeChildren()
  children: SaleRevenue[];

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User)
  created_by: User;

  @ManyToOne(() => User, { eager: true })
  updated_by: User;

  @UpdateDateColumn()
  updated_at: Date;
}
