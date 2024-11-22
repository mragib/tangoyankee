import { Attribute } from 'src/attribute/entities/attribute.entity';

import { Sale } from 'src/sales/entities/sale.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SalesItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @Column('double')
  sellingUnitPrice: number;

  @Column('double')
  buyingUnitPrice: number;

  @ManyToOne(() => Sale, (item) => item.saleItems, {
    onDelete: 'CASCADE',
  })
  sale: Sale;

  @ManyToOne(() => Attribute, (item) => item.salesItems, {
    eager: true,
  })
  attribute: Attribute;
}
