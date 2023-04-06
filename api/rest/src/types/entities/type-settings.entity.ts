import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Type } from './type.entity';

@Entity()
export class TypeSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  isHome: boolean;

  @Column({ length: 100 })
  layoutType: string;

  @Column({ length: 100 })
  productCard: string;

  @OneToOne(() => Type, (item) => item.settings, { onDelete: 'CASCADE' })
  @JoinColumn()
  type: Type;
}
