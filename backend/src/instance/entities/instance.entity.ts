import { AttributeSet } from 'src/attribute-set/entities/attribute-set.entity';
import { Attribute } from 'src/attribute/entities/attribute.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Instance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 80 })
  name: string;

  @ManyToOne(() => AttributeSet, (item) => item.instance, {
    eager: true,
    onDelete: 'CASCADE',
  })
  attribute_set: AttributeSet;

  @ManyToOne(() => User, { eager: true })
  created_by: User;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, { eager: true })
  updated_by: User;

  @UpdateDateColumn()
  updated_at: Date;

  // @OneToMany(() => AttributeInstance, (item) => item.value)
  // instance: AttributeInstance[];

  @ManyToMany(() => Attribute, (item) => item.instance)
  attribute: Attribute[];
}
