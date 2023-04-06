import { CoreEntity } from '../../common/entities/core.entity';

import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SettingsOptions } from './settingsOptions.entity';

@Entity()
export class Setting extends CoreEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  language: string;

  @Column('text', { array: true })
  translated_languages: string[];

  @OneToOne(() => SettingsOptions, { nullable: true })
  @JoinColumn()
  options: SettingsOptions;
}
