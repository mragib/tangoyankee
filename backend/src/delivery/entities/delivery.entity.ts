import { Type } from 'class-transformer';
import { DeliveryAction, DeliveryStatus } from 'src/common/common.enums';
import { Purchase } from 'src/purchase/entities/purchase.entity';
import { Sale } from 'src/sales/entities/sale.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Delivery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  deliveryDate: Date;

  @OneToOne(() => Purchase, (item) => item.delivery)
  purchase: Purchase;

  @OneToOne(() => Sale, (item) => item.delivery, { eager: true })
  sale: Sale;

  @Column({ type: 'text' })
  deliveryStatus: DeliveryStatus;

  @Column()
  deliveryAddress: string;

  @Column({ type: 'text' })
  action: DeliveryAction;

  @Column('double')
  deliveryCharge: number;
}
