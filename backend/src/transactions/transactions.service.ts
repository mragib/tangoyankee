import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { AbstractService } from 'src/common/abstract.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Between, Repository } from 'typeorm';
import { ChartofaccountingService } from 'src/chartofaccounting/chartofaccounting.service';
import { Chartofaccounting } from 'src/chartofaccounting/entities/chartofaccounting.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionType } from 'src/common/common.enums';
import {
  ACCOUNT_PAYABLE_CODE,
  ACCOUNT_RECEIVABLE_CODE,
  FINISH_GOODS_INVENTORY_ASSET_CODE,
  OPENING_BALANCE_EQUITY_CODE,
  SALES_REVENUE_CODE,
} from 'src/common/util';

@Injectable()
export class TransactionsService extends AbstractService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transectionRepository: Repository<Transaction>,
    private readonly chartOfAccountingService: ChartofaccountingService,
  ) {
    super(transectionRepository);
  }

  //create a transactions.
  async createTransactions(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const { debit_code, credit_code, total_amount } = createTransactionDto;
    const chartOfAccounting = await this.chartOfAccountingService.findAll();

    const debitAccount: Chartofaccounting = chartOfAccounting.find(
      (item) => item.code === debit_code,
    );

    const creditAccount: Chartofaccounting = chartOfAccounting.find(
      (item) => item.code === credit_code,
    );

    const journal = [
      {
        gl: debitAccount,
        dr_amount: total_amount,
      },
      {
        gl: creditAccount,
        cr_amount: total_amount,
      },
    ];
    createTransactionDto.journal = journal;
    const updatedDr_amount = debitAccount.dr_amount + Number(total_amount);
    const updatedCr_amount = creditAccount.cr_amount + Number(total_amount);

    try {
      await this.chartOfAccountingService.update(debitAccount.id, {
        ...debitAccount,
        dr_amount: updatedDr_amount.toFixed(2),
      });
      await this.chartOfAccountingService.update(creditAccount.id, {
        ...creditAccount,
        cr_amount: updatedCr_amount.toFixed(2),
      });

      const transaction =
        await this.transectionRepository.save(createTransactionDto);
      return transaction;
    } catch (error) {
      // console.error(`transactions service: ` + error);
      throw new InternalServerErrorException(error);
    }
  }

  //when create a new bank account
  async createBankTransactions(
    name: string,
    amount: number,
    code: number,
    parent: Chartofaccounting,
  ) {
    const transaction_date = new Date(Date.now()).toDateString();
    try {
      const ledger = {
        code,
        name,
        gl_type: 'Asset',
        is_leaf: true,
        dr_amount: 0,
        parent,
      };
      const debit = await this.chartOfAccountingService.create(ledger);

      await this.createTransactions({
        debit_code: debit.code,
        credit_code: OPENING_BALANCE_EQUITY_CODE,
        description: `${name}-opening balance`,
        total_amount: amount,
        transaction_date,
        transaction_type: TransactionType.OPENING_BALANCE,
      });
      return debit;
    } catch (error) {
      if (error.errno === 19 || error.errno === 1062)
        throw new ConflictException('Account Code is already exists');
      throw new InternalServerErrorException('Something went wrong!>🔥');
    }
  }

  async createPurchaseTransactions(
    totalAmount: number,
    transaction_date: string,
    invoiceNumber: string,
  ) {
    try {
      const purchaseTransaction = await this.createTransactions({
        debit_code: FINISH_GOODS_INVENTORY_ASSET_CODE,
        credit_code: ACCOUNT_PAYABLE_CODE,
        description: `Purchase of Goods - INVOICE-${invoiceNumber}`,
        total_amount: totalAmount,
        transaction_date,
        transaction_type: TransactionType.PURCHASE,
      });
      return purchaseTransaction;
    } catch (error) {
      console.log(error);
    }
  }

  async createSalesTransactions(
    totalAmount: number,
    transaction_date: string,
    invoiceNumber: string,
  ) {
    try {
      const salesTransaction = await this.createTransactions({
        debit_code: ACCOUNT_RECEIVABLE_CODE,
        credit_code: SALES_REVENUE_CODE,
        description: `Sales of Goods - INVOICE-${invoiceNumber}`,
        total_amount: totalAmount,
        transaction_date,
        transaction_type: TransactionType.SALE,
      });
      return salesTransaction;
    } catch (error) {
      console.log(error);
    }
  }

  // Get transactions for a specific date
  async getTransactionsByDate(date: Date): Promise<Transaction[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0); // Start of the day

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999); // End of the day

    return this.transectionRepository.find({
      where: {
        created_at: Between(startOfDay, endOfDay),
      },
    });
  }

  // Get transactions between two dates
  async getTransactionsBetweenDates(
    startDate: Date,
    endDate: Date,
  ): Promise<Transaction[]> {
    const startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0); // Start of the day

    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999); // End of the day

    return this.transectionRepository.find({
      where: {
        created_at: Between(startOfDay, endOfDay),
      },
    });
  }
}
