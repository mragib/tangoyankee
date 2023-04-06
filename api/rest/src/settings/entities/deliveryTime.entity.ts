import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SettingsOptions } from './settingsOptions.entity';

@Entity()
export class DeliveryTime extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToOne(() => SettingsOptions, (options) => options.deliveryTime)
  options: SettingsOptions;
}
