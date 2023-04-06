import { UserAddress } from '../../addresses/entities/address.entity';
import { Attachment } from '../../common/entities/attachment.entity';
import { CoreEntity } from '../../common/entities/core.entity';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OneToMany } from 'typeorm/decorator/relations/OneToMany';
import { Balance } from './balance.entity';
import { ShopSettings } from './shopSettings.entity';
import { Attribute } from 'src/attributes/entities/attribute.entity';

@Entity()
export class Shop extends CoreEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.shops)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column()
  owner_id: number;

  @OneToMany(() => User, (user) => user.managed_shop)
  staffs?: User[];

  @Column()
  is_active: boolean;

  @Column()
  orders_count: number;

  @Column()
  products_count: number;

  @OneToOne(() => Balance)
  @JoinColumn()
  balance?: Balance;

  @Column()
  name: string;

  @Column()
  slug: string;

  @Column({ nullable: true })
  description?: string;

  @OneToOne(() => Attachment)
  @JoinColumn()
  cover_image: Attachment;

  @OneToOne(() => Attachment)
  @JoinColumn()
  logo?: Attachment;

  @ManyToOne(() => UserAddress)
  address: UserAddress;

  @OneToOne(() => ShopSettings)
  @JoinColumn()
  settings?: ShopSettings;

  @OneToMany(() => Attribute, (item) => item.shop)
  attributes: any;
}
