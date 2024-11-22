import { Attribute } from 'src/attribute/entities/attribute.entity';

import { Purchase } from '../../purchase/entities/purchase.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class PurchaseItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Attribute, (item) => item.purchaseItems, {
    eager: true,
    onDelete: 'CASCADE',
  })
  attribute: Attribute;

  @ManyToOne(() => Purchase, (item) => item.purchaseItems, {
    onDelete: 'CASCADE',
  })
  purchase: Purchase;

  @Column()
  quantity: number;

  @Column('double')
  buyingUnitPrice: number;

  @Column()
  lot_quantity: number;

  @CreateDateColumn()
  created_at: Date;
}
