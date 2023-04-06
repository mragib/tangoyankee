import { Order } from '../../orders/entities/order.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class OrderProductPivot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  variation_option_id?: number;

  @Column()
  order_quantity: number;

  @Column()
  unit_price: number;

  @Column()
  subtotal: number;
}
