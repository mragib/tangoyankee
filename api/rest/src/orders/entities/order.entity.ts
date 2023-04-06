import { UserAddress } from '../../addresses/entities/address.entity';
import { CoreEntity } from '../../common/entities/core.entity';
import { Coupon } from '../../coupons/entities/coupon.entity';
import { Product } from '../../products/entities/product.entity';
import { Shop } from '../../shops/entities/shop.entity';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderStatus } from './order-status.entity';
import { PaymentGatewayType } from '../../common/enums/common.enum';

@Entity()
export class Order extends CoreEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tracking_number: string;

  @Column()
  customer_id: number;

  @Column()
  customer_contact: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'customer_id' })
  customer: User;

  @OneToOne(() => Order, (order) => order.children)
  parent_order?: Order;

  @OneToOne(() => Order, (order) => order.parent_order)
  children?: Order[];

  @OneToOne(() => OrderStatus, { eager: true })
  @JoinColumn()
  status: OrderStatus;

  @Column()
  amount: number;

  @Column()
  sales_tax: number;

  @Column()
  total: number;
  @Column()
  paid_total: number;

  @Column({ nullable: true })
  payment_id?: string;

  @Column({
    type: 'enum',
    enum: PaymentGatewayType,
    default: PaymentGatewayType.CASH_ON_DELIVERY,
  })
  payment_gateway: PaymentGatewayType;

  @OneToMany(() => Coupon, (item) => item.orders)
  coupon?: Coupon;

  @OneToOne(() => Shop)
  @JoinColumn({ name: 'shop_id' })
  shop: Shop;

  @Column({ nullable: true })
  discount?: number;

  @Column()
  delivery_fee: number;

  @Column()
  delivery_time: string;

  @ManyToMany(() => Product, (item) => item.orders)
  @JoinTable({ name: 'order_product_pivot' })
  products: Product[];

  @OneToOne(() => UserAddress)
  @JoinColumn({ name: 'billing_address_id' })
  billing_address: UserAddress;

  @OneToOne(() => UserAddress)
  @JoinColumn({ name: 'shipping_address_id' })
  shipping_address: UserAddress;

  @Column({ nullable: true })
  language?: string;

  @Column({ type: 'simple-array', nullable: true })
  translated_languages?: string[];
}
