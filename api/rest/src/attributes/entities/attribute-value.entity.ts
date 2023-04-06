import { CoreEntity } from 'src/common/entities/core.entity';
import { Product } from 'src/products/entities/product.entity';
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Attribute } from './attribute.entity';

@Entity()
export class AttributeValue extends CoreEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  shop_id: number;

  @Column()
  value: string;

  @Column({ nullable: true })
  meta?: string;

  @ManyToOne((type) => Attribute, (attribute) => attribute.values)
  attribute: Attribute;

  @ManyToOne(() => Product, (item) => item.variations)
  product: Product;
}
