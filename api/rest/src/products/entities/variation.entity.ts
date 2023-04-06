import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Product } from './product.entity';
import { VariationOption } from './variation-option.entity';

@Entity()
export class Variation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  price: number;

  @Column()
  sku: string;

  @Column()
  is_disable: boolean;

  @Column({ nullable: true })
  sale_price?: number;

  @Column()
  quantity: number;

  @OneToMany((type) => VariationOption, (option) => option.variation)
  options: VariationOption[];

  @ManyToOne(() => Product, (item) => item.variation_options)
  product: Product;
}
