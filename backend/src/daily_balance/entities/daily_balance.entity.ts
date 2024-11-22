import { Chartofaccounting } from 'src/chartofaccounting/entities/chartofaccounting.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique(['date', 'chartOfAccounting'])
export class DailyBalance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: Date;

  @ManyToOne(() => Chartofaccounting, (item) => item.daily_balance, {
    eager: true,
  })
  chartOfAccounting: Chartofaccounting;

  @Column('decimal')
  opening_balance: number;

  @Column('decimal')
  closing_balance: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
