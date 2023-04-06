import { Exclude } from 'class-transformer';
import { Address } from 'src/addresses/entities/address.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Role } from 'src/role/entities/role.entity';
// import { Order } from 'src/orders/entities/order.entity';
import { Shop } from 'src/shops/entities/shop.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OneToOne } from 'typeorm/decorator/relations/OneToOne';
import { Profile } from './profile.entity';

@Entity()
export class User extends CoreEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password?: string;

  @Column()
  salt?: string;

  @Column({ nullable: true })
  shop_id?: number;

  @OneToOne((type) => Profile, (profile) => profile.customer)
  profile?: Profile;

  @OneToMany((type) => Shop, (shop) => shop.owner)
  shops?: Shop[];

  @ManyToOne((type) => Shop, (shop) => shop.staffs)
  managed_shop?: Shop;

  @Column({ default: true })
  is_active?: boolean;

  @OneToMany((type) => Address, (address) => address.customer)
  address?: Address[];

  @ManyToOne(() => Role, (role) => role.user, { eager: true })
  role: Role[];
  @Column({ default: 2 })
  @Exclude()
  roleId: number;
}
