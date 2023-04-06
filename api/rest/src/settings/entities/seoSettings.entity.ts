import { Attachment } from 'src/common/entities/attachment.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class SeoSettings extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  metaTitle?: string;

  @Column()
  metaDescription?: string;

  @Column()
  ogTitle?: string;

  @Column()
  ogDescription?: string;

  @OneToOne(() => Attachment)
  @JoinColumn()
  ogImage?: Attachment;

  @Column()
  twitterHandle?: string;

  @Column()
  twitterCardType?: string;

  @Column()
  metaTags?: string;

  @Column()
  canonicalUrl?: string;
}
