import { ShopSettings } from 'src/shops/entities/shopSettings.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ContactDetails } from './contactDetails.entity';

@Entity()
export class ShopSocials {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  icon: string;

  @Column()
  url: string;

  @ManyToOne(() => ContactDetails, (contact) => contact.socials)
  contactDetails: ShopSocials;

  @ManyToOne(() => ShopSettings, (setting) => setting.socials)
  settings: ShopSettings;
}
