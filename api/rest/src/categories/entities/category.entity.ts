import { Attachment } from 'src/common/entities/attachment.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Product } from 'src/products/entities/product.entity';
import { Type } from 'src/types/entities/type.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Category extends CoreEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100 })
  slug: string;

  @ManyToOne((type) => Category, (category) => category.children)
  parent?: Category;

  @OneToMany((type) => Category, (category) => category.parent)
  children?: Category[];

  @Column({ nullable: true })
  details?: string;

  @OneToOne(() => Attachment, (item) => item.category, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  image?: Attachment;

  @Column({ length: 100 })
  icon?: string;

  @ManyToOne(() => Type, (item) => item.category, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'type_id' })
  type?: Type;

  @Column({ default: null })
  type_id: number;

  @ManyToMany(() => Product, (item) => item.categories)
  products?: Product[];

  @Column({ nullable: true, default: 'en' })
  language?: string;

  @Column({ type: 'simple-array', nullable: true, default: 'en' })
  translated_languages?: string[];
}
