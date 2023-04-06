import { Shop } from '../../shops/entities/shop.entity';
import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  BaseEntity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AttributeValue } from './attribute-value.entity';

@Entity()
export class Attribute extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  shop_id: number;

  @ManyToOne((type) => Shop, (shop) => shop.attributes)
  shop: Shop;

  @Column()
  slug: string;

  @OneToMany(
    (type) => AttributeValue,
    (attributeValue) => attributeValue.attribute,
  )
  values: AttributeValue[];

  @Column({ nullable: true })
  language?: string;

  @Column('simple-array', { nullable: true })
  translated_languages?: string[];
}
