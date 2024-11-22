import { TransactionType } from 'src/common/common.enums';
import { Expense } from 'src/expense/entities/expense.entity';
import { Journal } from 'src/journal/entities/journal.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  transaction_date: Date;

  @Column()
  description: string;

  @Column('double')
  total_amount: number;

  @Column({ type: 'text' })
  transaction_type: TransactionType;

  @CreateDateColumn()
  created_at: Date;

  // for Bi directional
  @OneToMany(() => Journal, (item) => item.transaction, {
    cascade: true,
    eager: true,
  })
  journal: Journal[];

  @OneToOne(() => Expense, (item) => item.transaction)
  expense: Expense;
}
