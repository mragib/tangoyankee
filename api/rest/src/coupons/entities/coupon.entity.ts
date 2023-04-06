import { Attachment } from '../../common/entities/attachment.entity';
import { CoreEntity } from '../../common/entities/core.entity';
import { CouponType } from '../../common/enums/common.enum';
import { Order } from '../../orders/entities/order.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Coupon extends CoreEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description?: string;

  @ManyToOne(() => Order, (item) => item.coupon)
  orders?: Order[];

  @Column({ type: 'enum', enum: CouponType })
  type: CouponType;

  @OneToMany(() => Attachment, (item) => item.coupon)
  image: Attachment;

  @Column()
  is_valid: boolean;

  @Column()
  amount: number;

  @Column()
  active_from: string;

  @Column()
  expire_at: string;

  @Column({ nullable: true })
  language?: string;

  @Column({ type: 'simple-array', nullable: true })
  translated_languages?: string[];
}
