import { Accounts } from 'src/accounts/entities/accounts.entity';
import { Purchase } from 'src/purchase/entities/purchase.entity';
import { Supplier } from 'src/supplier/entities/supplier.entity';
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
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Purchase, (item) => item.payment, { onDelete: 'CASCADE' })
  purchase: Purchase;

  @Column()
  purchaseId: number;

  @ManyToOne(() => Supplier, (item) => item.payment)
  supplier: Supplier;

  @Column()
  supplierId: number;

  @ManyToOne(() => Accounts, (item) => item.payment, {
    eager: true,
  })
  account: Accounts;

  @Column()
  paymentDate: Date;

  @Column('double')
  amountPaid: number;

  @Column({ nullable: true })
  cheque_number: string;

  @Column({ default: true })
  is_valid: boolean;

  @TreeParent()
  parent: Payment;

  @TreeChildren()
  child: Payment[];

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, { eager: true })
  created_by: User;

  @ManyToOne(() => User, { eager: true })
  updated_by: User;

  @UpdateDateColumn()
  updated_at: Date;
}
