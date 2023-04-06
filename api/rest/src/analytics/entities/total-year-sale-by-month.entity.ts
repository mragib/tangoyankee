import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Analytics } from './analytics.entity';

@Entity()
export class TotalYearSaleByMonth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  total?: number;

  @Column()
  month?: string;

  @ManyToOne(() => Analytics, (item) => item.totalYearSaleByMonth)
  analytices: Analytics;
}
