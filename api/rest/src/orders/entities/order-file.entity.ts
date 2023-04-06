import { File } from '../../products/entities/file.entity';
import { Product } from '../../products/entities/product.entity';
import { Column, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';

export class OrderFiles extends CoreEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  purchase_key: string;

  @Column()
  digital_file_id: number;

  @Column({ nullable: true })
  order_id?: number;

  @Column()
  customer_id: number;

  // @ManyToOne(type => File, file => file.order_files)
  @OneToOne(() => File)
  @JoinColumn({ name: 'digital_file_id' })
  file: File;

  // @ManyToOne(type => Product, product => product.order_files)
  @OneToOne(() => Product)
  @JoinColumn({ name: 'fileable_id' })
  fileable: Product;
}
