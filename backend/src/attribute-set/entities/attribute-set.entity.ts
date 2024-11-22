import { Instance } from 'src/instance/entities/instance.entity';
import { User } from 'src/user/entities/user.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class AttributeSet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToOne(() => User, { eager: true })
  created_by: User;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, { eager: true })
  updated_by: User;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Instance, (item) => item.attribute_set)
  instance: Instance[];
}
