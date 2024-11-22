import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Accounts } from './entities/accounts.entity';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { TransactionsModule } from 'src/transactions/transactions.module';

@Module({
  imports: [TypeOrmModule.forFeature([Accounts]), TransactionsModule],
  controllers: [AccountsController],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class AccountsModule {}
