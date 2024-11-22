import { Accounts } from 'src/accounts/entities/accounts.entity';
import { AccountType } from 'src/common/common.enums';
import { DailyBalance } from 'src/daily_balance/entities/daily_balance.entity';
import { Journal } from 'src/journal/entities/journal.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
@Entity('ledger')
@Tree('materialized-path')
export class Chartofaccounting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  gl_type: AccountType;

  @Column({ default: true })
  is_leaf: boolean;

  @Column('double precision', { default: 0 })
  dr_amount: number;

  @Column('double precision', { default: 0 })
  cr_amount: number;

  @TreeParent({ onDelete: 'CASCADE' })
  parent: Chartofaccounting;

  @TreeChildren()
  child: Chartofaccounting[];

  @CreateDateColumn()
  created_at: Date;

  // Bi direactional relation
  @OneToMany(() => Journal, (item) => item.gl)
  journal: Journal[];

  @OneToMany(() => Accounts, (account) => account.chartOfAccounting)
  accounts: Accounts[];

  @OneToMany(() => DailyBalance, (item) => item.chartOfAccounting)
  daily_balance: DailyBalance[];
}
