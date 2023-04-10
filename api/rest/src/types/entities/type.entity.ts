import { Category } from 'src/categories/entities/category.entity';
import { Attachment } from 'src/common/entities/attachment.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Banner } from './banner.entity';
import { TypeSettings } from './type-settings.entity';

@Entity()
export class Type extends CoreEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;
  @Column({ length: 50 })
  slug: string;

  @Column({ length: 100 })
  icon: string;

  @OneToMany(() => Banner, (item) => item.type, {
    onDelete: 'CASCADE',
    eager: true,
  })
  banners?: Banner[];

  @OneToMany(() => Attachment, (item) => item.type, {
    eager: true,
    onDelete: 'CASCADE',
  })
  promotional_sliders?: Attachment[];

  @OneToOne(() => TypeSettings, (item) => item.type, {
    eager: true,
    onDelete: 'CASCADE',
  })
  settings?: TypeSettings;

  @Column({ nullable: true, default: 'en' })
  language?: string;

  @Column({ type: 'simple-array', nullable: true, default: 'en' })
  translated_languages?: string[];

  // Relation

  @OneToMany(() => Category, (item) => item.type)
  category?: Category[];

  @OneToMany(() => Tag, (item) => item.type)
  tag: Tag[];
}
