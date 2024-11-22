import { Supplier } from 'src/supplier/entities/supplier.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SupplierPaymentPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Supplier, (item) => item.payment_plan)
  supplier: Supplier;

  @Column()
  next_payment_date: Date;

  @Column({ nullable: true })
  paid_on: Date;
}
