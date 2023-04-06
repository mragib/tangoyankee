import { Location } from 'src/settings/entities/location.entity';
import { ShopSocials } from 'src/settings/entities/shopSocials.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ShopSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => ShopSocials, (social) => social.settings)
  socials: ShopSocials[];

  @Column()
  contact: string;

  @OneToOne(() => Location)
  @JoinColumn()
  location: Location;

  @Column()
  website: string;
}
