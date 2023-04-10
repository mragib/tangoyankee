import { Attachment } from 'src/common/entities/attachment.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Product } from 'src/products/entities/product.entity';
import { Type } from 'src/types/entities/type.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Tag extends CoreEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100 })
  slug: string;

  @Column()
  details?: string;

  @OneToOne(() => Attachment, (item) => item.tag, {
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  image: Attachment;

  @Column({ length: 100 })
  icon: string;

  @ManyToOne(() => Type, (item) => item.tag, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'type_id' })
  type: Type;

  @Column()
  type_id: number;

  @ManyToMany(() => Product, (item) => item.tags)
  @JoinTable()
  products: Product[];

  @Column({ nullable: true, default: 'en' })
  language?: string;

  @Column({ type: 'simple-array', nullable: true, default: 'en' })
  translated_languages?: string[];
}
