import { CoreEntity } from '../../common/entities/core.entity';
import { AddressType } from '../../common/enums/common.enum';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class UserAddress extends CoreEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  street_address: string;

  @Column()
  country: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  zip: string;
}

@Entity()
export class Address extends CoreEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: false })
  default: boolean;

  @OneToOne(() => UserAddress)
  @JoinColumn()
  address: UserAddress;

  @Column({
    type: 'enum',
    enum: AddressType,
    default: AddressType.BILLING,
  })
  type: AddressType;

  @ManyToOne(() => User, (user) => user.address)
  customer: User;
}
