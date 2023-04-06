import { Attachment } from 'src/common/entities/attachment.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ContactDetails } from './contactDetails.entity';
import { DeliveryTime } from './deliveryTime.entity';
import { FacebookSettings } from './facebookSettings.entity';
import { GoogleSettings } from './googleSetting.entity';
import { SeoSettings } from './seoSettings.entity';

@Entity()
export class SettingsOptions extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  siteTitle: string;

  @Column()
  siteSubtitle: string;

  @Column()
  currency: string;

  @Column()
  minimumOrderAmount: number;

  @Column()
  walletToCurrencyRatio: number;

  @Column()
  signupPoints: number;

  @OneToMany(() => DeliveryTime, (deliveryTime) => deliveryTime.options)
  deliveryTime: DeliveryTime[];

  @OneToOne(() => Attachment)
  @JoinColumn()
  logo: Attachment;

  @Column()
  taxClass: string;

  @Column()
  shippingClass: string;

  @OneToOne(() => SeoSettings)
  @JoinColumn()
  seo: SeoSettings;

  @OneToOne(() => GoogleSettings)
  @JoinColumn()
  google?: GoogleSettings;

  @OneToOne(() => FacebookSettings)
  @JoinColumn()
  facebook?: FacebookSettings;

  @OneToOne(() => ContactDetails)
  @JoinColumn()
  contactDetails: ContactDetails;

  @Column()
  maximumQuestionLimit: number;
}
