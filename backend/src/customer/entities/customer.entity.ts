import { Expose } from 'class-transformer';
import { CustomerPaymentPlan } from 'src/customer-payment-plan/entities/customer-payment-plan.entity';
import { SaleRevenue } from 'src/sale_revenue/entities/sale_revenue.entity';
import { Sale } from 'src/sales/entities/sale.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 60, nullable: true })
  name: string;

  @Column({ length: 13, unique: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  email: string;

  @Column({ default: true })
  is_active: boolean;

  //for bi directional
  @OneToMany(() => Sale, (item) => item.customer, {
    onDelete: 'CASCADE',
  })
  sale: Sale[];

  @OneToMany(() => SaleRevenue, (item) => item.customer)
  saleRevenue: SaleRevenue[];

  @OneToMany(() => CustomerPaymentPlan, (item) => item.customer)
  payment_plan: CustomerPaymentPlan;

  // @Expose()
  // get customer_due(): number {
  //   const total_payable = this.sale.reduce(
  //     (acc, curr) => acc + curr.totalAmount,
  //     0,
  //   );
  //   const total_paid = this.saleRevenue.reduce(
  //     (acc, curr) => acc + curr.amountPaid,
  //     0,
  //   );

  //   return Math.ceil(total_payable - total_paid);
  // }

  @ManyToOne(() => User, { eager: true })
  created_by: User;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, { eager: true })
  updated_by: User;

  @UpdateDateColumn()
  updated_at: Date;
}
