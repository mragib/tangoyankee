import { AttributeValue } from 'src/attributes/entities/attribute-value.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Attachment } from 'src/common/entities/attachment.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Shop } from 'src/shops/entities/shop.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { Type } from 'src/types/entities/type.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
  OneToOne,
  Entity,
} from 'typeorm';
import { Review } from '../../reviews/entities/review.entity';
import { OrderProductPivot } from './order-product-pivot.entity';
import { Variation } from './variation.entity';

import { ProductStatus, ProductType } from '../../common/enums/common.enum';

@Entity()
export class Product extends CoreEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  slug: string;

  @ManyToOne((type) => Type)
  type: Type;

  @Column()
  type_id: number;

  @Column({
    type: 'enum',
    enum: ProductType,
  })
  product_type: ProductType;

  @ManyToMany((type) => Category)
  @JoinTable()
  categories: Category[];

  @ManyToMany((type) => Tag, (item) => item.products)
  tags?: Tag[];

  @OneToMany(
    (type) => AttributeValue,
    (attributeValue) => attributeValue.product,
  )
  variations?: AttributeValue[];

  @OneToMany((type) => Variation, (variation) => variation.product)
  variation_options?: Variation[];

  pivot?: OrderProductPivot;

  @ManyToMany((type) => Order)
  orders?: Order[];

  @ManyToOne((type) => Shop)
  shop: Shop;

  @Column()
  shop_id: number;

  @ManyToMany((type) => Product, { eager: true })
  related_products?: Product[];

  @Column()
  description: string;

  @Column({ default: true })
  in_stock: boolean;

  @Column({ default: true })
  is_taxable: boolean;

  @Column({ nullable: true })
  sale_price?: number;

  @Column({ nullable: true })
  max_price?: number;

  @Column({ nullable: true })
  min_price?: number;

  @Column({ nullable: true })
  sku?: string;

  @OneToMany((type) => Attachment, (attachment) => attachment.fileable)
  gallery?: Attachment[];

  @ManyToOne((type) => Attachment)
  image?: Attachment;

  @Column({
    type: 'enum',
    enum: ProductStatus,
  })
  status: ProductStatus;

  @Column({ nullable: true })
  height?: string;

  @Column({ nullable: true })
  length?: string;

  @Column({ nullable: true })
  width?: string;

  @Column({ nullable: true })
  price?: number;

  @Column({ nullable: true })
  quantity: number;

  @Column({ nullable: true })
  unit: string;

  @Column({ nullable: true })
  ratings: number;

  @Column({ default: false })
  in_wishlist: boolean;

  // @OneToMany((type) => Review, (review) => review.product)
  // my_review?: Review[];

  @Column({ nullable: true })
  language?: string;

  @Column({ type: 'simple-array', nullable: true })
  translated_languages?: string[];
}
