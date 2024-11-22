import { Delivery } from 'src/delivery/entities/delivery.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { PurchaseItem } from 'src/purchase_items/entities/purchase_item.entity';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Supplier, (item) => item.purchase, { eager: true })
  supplier: Supplier;

  @Column()
  purchaseDate: Date;

  @Column('double')
  totalAmount: number;

  @Column({ length: 50, unique: true })
  invoiceNumber: string;

  //For Bi directional relation
  @OneToMany(() => PurchaseItem, (item) => item.purchase, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  purchaseItems: PurchaseItem[];

  @OneToMany(() => Payment, (item) => item.purchase, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  payment: Payment[];

  @OneToOne(() => Delivery, (item) => item.purchase, { cascade: true })
  @JoinColumn()
  delivery: Delivery;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User)
  created_by: User;

  @ManyToOne(() => User, { eager: true })
  updated_by: User;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User)
  deleted_by: User;

  @DeleteDateColumn()
  deleted_at: Date;
}
