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

  @OneToMany(() => Attachment, (item) => item.tag)
  @JoinColumn()
  image: Attachment;

  @Column({ length: 100 })
  icon: string;

  @OneToOne(() => Type, (item) => item.tag)
  @JoinColumn()
  type: Type;

  @ManyToMany(() => Product, (item) => item.tags)
  @JoinTable()
  products: Product[];

  @Column({ nullable: true, default: 'en' })
  language?: string;

  @Column({ type: 'simple-array', nullable: true, default: 'en' })
  translated_languages?: string[];
}
