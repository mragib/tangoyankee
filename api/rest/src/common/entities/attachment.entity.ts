import { Category } from 'src/categories/entities/category.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Coupon } from 'src/coupons/entities/coupon.entity';
import { Product } from 'src/products/entities/product.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { Banner } from 'src/types/entities/banner.entity';
import { Type } from 'src/types/entities/type.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Attachment extends CoreEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  thumbnail?: string;

  @Column()
  original?: string;

  @ManyToOne(() => Product, (item) => item.gallery)
  fileable?: Product;

  @ManyToOne(() => Coupon, (item) => item.image)
  coupon?: Coupon;

  @ManyToOne(() => Type, (item) => item.promotional_sliders, {
    onDelete: 'CASCADE',
  })
  type?: Type;

  //relations
  @OneToOne(() => Category, (item) => item.image)
  category?: Category;

  @OneToOne(() => Tag, (item) => item.image)
  tag?: Tag;

  @OneToOne(() => Banner, (item) => item.image, { onDelete: 'CASCADE' })
  @JoinColumn()
  banner: Banner;
}
