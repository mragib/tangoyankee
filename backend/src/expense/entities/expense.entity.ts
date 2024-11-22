import { Transaction } from 'src/transactions/entities/transaction.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @OneToOne(() => Transaction, (item) => item.expense, { eager: true })
  @JoinColumn()
  transaction: Transaction;

  @Column()
  amount: number;

  @Column()
  expenseDate: Date;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, { eager: true })
  created_by: User;

  @ManyToOne(() => User, { eager: true })
  updated_by: User;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleteAt: Date;
}
