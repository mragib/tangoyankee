import { User } from 'src/user/entities/user.entity';
import { Payment } from '../../payments/entities/payment.entity';

import { Purchase } from '../../purchase/entities/purchase.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SupplierPaymentPlan } from 'src/supplier-payment-plan/entities/supplier-payment-plan.entity';
@Entity()
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column()
  address: string;

  @Column({ length: 50 })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ length: 80 })
  owner: string;

  @Column({ default: true })
  status: boolean;

  @ManyToOne(() => User, { eager: true })
  created_by: User;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, { eager: true })
  updated_by: User;

  @UpdateDateColumn()
  updated_at: Date;

  // for bi directional
  @OneToMany(() => Purchase, (item) => item.supplier, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  purchase: Purchase[];

  @OneToMany(() => Payment, (item) => item.supplier, {
    onDelete: 'SET NULL',
  })
  payment: Payment[];

  @OneToMany(() => SupplierPaymentPlan, (item) => item.supplier)
  payment_plan: SupplierPaymentPlan[];
}
