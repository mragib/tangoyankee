import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TotalYearSaleByMonth } from './total-year-sale-by-month.entity';

@Entity()
export class Analytics extends CoreEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  totalRevenue?: number;

  @Column()
  totalShops?: number;

  @Column()
  todaysRevenue?: number;

  @Column()
  totalOrders?: number;

  @Column()
  newCustomers?: number;

  @OneToMany(() => TotalYearSaleByMonth, (item) => item.analytices, {
    eager: true,
  })
  totalYearSaleByMonth?: TotalYearSaleByMonth[];
}
