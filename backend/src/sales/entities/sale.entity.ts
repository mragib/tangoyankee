import { Customer } from 'src/customer/entities/customer.entity';
import { Delivery } from 'src/delivery/entities/delivery.entity';
import { SaleRevenue } from 'src/sale_revenue/entities/sale_revenue.entity';
import { SalesItem } from 'src/sales_items/entities/sales_item.entity';
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
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('double')
  totalAmount: number;

  @Column({ length: 50, unique: true })
  invoiceNumber: string;

  @Column({ default: 0 })
  discount: number;

  @ManyToOne(() => Customer, (item) => item.sale, {
    cascade: true,
    eager: true,
  })
  customer: Customer;

  @CreateDateColumn()
  salesDate: Date;

  //For Bidrectional Relations only
  @OneToMany(() => SalesItem, (item) => item.sale, {
    cascade: true,
    orphanedRowAction: 'delete',
    eager: true,
  })
  saleItems: SalesItem[];

  @OneToMany(() => SaleRevenue, (item) => item.sale, {
    cascade: true,
    eager: true,
    orphanedRowAction: 'delete',
  })
  saleRevenue: SaleRevenue[];

  @OneToOne(() => Delivery, (item) => item.sale, { cascade: true })
  @JoinColumn()
  delivery: Delivery;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, { eager: true })
  created_by: User;

  @ManyToOne(() => User, { eager: true })
  updated_by: User;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => User)
  deleted_by: User;
}
