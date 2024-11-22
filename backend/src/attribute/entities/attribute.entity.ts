import { Expose } from 'class-transformer';
import { Instance } from 'src/instance/entities/instance.entity';
import { Product } from 'src/product/entities/product.entity';
import { PurchaseItem } from 'src/purchase_items/entities/purchase_item.entity';
import { SalesItem } from 'src/sales_items/entities/sales_item.entity';
import { Storage } from 'src/storage/entities/storage.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Attribute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('double', { default: 0 })
  sellingUnitPrice: number;

  @Column('double', { default: 0 })
  buyingUnitPrice: number;

  @ManyToOne(() => Product, (item) => item.attribute, { eager: true })
  product: Product;

  @ManyToMany(() => Instance, (item) => item.attribute, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinTable({ name: 'attribute_instance' })
  instance: Instance[];

  @OneToOne(() => Storage, (item) => item.p_attribute, {
    cascade: true,
    eager: true,
  })
  storage: Storage;

  // For unique product
  @Column({ unique: true, nullable: false })
  sku: string;

  @ManyToOne(() => User, { eager: true })
  created_by: User;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, { eager: true })
  updated_by: User;

  @UpdateDateColumn()
  updated_at: Date;

  //For bi directions relation purpose
  @OneToMany(() => PurchaseItem, (item) => item.attribute)
  purchaseItems: PurchaseItem[];

  @OneToMany(() => SalesItem, (item) => item.attribute)
  salesItems: SalesItem[];

  @Expose()
  get productName(): string {
    return this.instance.reduce(
      (acc, curr) => acc + `--${curr.name}`,
      this.product.name,
    );
  }
}
