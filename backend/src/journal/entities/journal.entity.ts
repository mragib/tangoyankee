import { Chartofaccounting } from 'src/chartofaccounting/entities/chartofaccounting.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Journal {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Transaction, (item) => item.journal, { onDelete: 'CASCADE' })
  transaction: Transaction;

  @ManyToOne(() => Chartofaccounting, (item) => item.journal, { eager: true })
  gl: Chartofaccounting;

  @Column('decimal', { default: 0 })
  dr_amount: number;

  @Column('decimal', { default: 0 })
  cr_amount: number;

  @CreateDateColumn()
  created_at: Date;
}
