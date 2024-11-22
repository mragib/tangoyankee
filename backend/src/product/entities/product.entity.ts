import { Attribute } from 'src/attribute/entities/attribute.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Tree('materialized-path')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  unit: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  image: string;

  @Column({ default: true })
  is_leaf: boolean;

  @TreeParent({ onDelete: 'CASCADE' })
  parent: Product;

  @TreeChildren()
  child: Product[];

  @OneToMany(() => Attribute, (item) => item.product)
  attribute: Attribute[];

  @ManyToOne(() => User, { eager: true })
  created_by: User;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, { eager: true })
  updated_by: User;

  @UpdateDateColumn()
  updated_at: Date;
}
