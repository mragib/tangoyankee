import { Customer } from 'src/customer/entities/customer.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CustomerPaymentPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer, (item) => item.payment_plan)
  customer: Customer;

  @Column()
  next_payment_date: Date;

  @Column({ nullable: true })
  paid_on: Date;
}
