import { Attribute } from 'src/attribute/entities/attribute.entity';
import { Locator } from 'src/locator/entities/locator.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Storage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Locator, (item) => item.storage, {
    eager: true,
    cascade: true,
  })
  locator: Locator;

  @OneToOne(() => Attribute, (item) => item.storage, { onDelete: 'CASCADE' })
  @JoinColumn()
  p_attribute: Attribute;

  @Column()
  quantity: number;

  @Column()
  lot_quantity: number;

  @Column({ default: true })
  is_active: boolean;

  @ManyToOne(() => User, { eager: true })
  created_by: User;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, { eager: true })
  updated_by: User;

  @UpdateDateColumn()
  updated_at: Date;
}
