import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Location } from './location.entity';
import { ShopSocials } from './shopSocials.entity';

@Entity()
export class ContactDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => ShopSocials, (social) => social.contactDetails)
  socials: ShopSocials[];

  @Column()
  contact: string;

  @OneToOne(() => Location)
  @JoinColumn()
  location: Location;

  @Column()
  website: string;
}
