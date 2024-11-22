import { CreateTransferMoneyDto } from './dto/create-transfer-money.dto';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateAccountsDto } from './dto/create-accounts.dto';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Accounts } from './entities/accounts.entity';
import { UpdateAccountsDto } from './dto/update-accounts.dto';
import { TransactionsService } from 'src/transactions/transactions.service';
import { Chartofaccounting } from 'src/chartofaccounting/entities/chartofaccounting.entity';
import { OPENING_BALANCE_EQUITY_CODE } from 'src/common/util';
import { TransactionType } from 'src/common/common.enums';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Accounts)
    private readonly accountsRepository: Repository<Accounts>,
    private readonly transactionService: TransactionsService,
  ) {}
  async createPayment(createAccountsDto: CreateAccountsDto) {
    try {
      const newChartOfAccounting: Chartofaccounting =
        await this.transactionService.createBankTransactions(
          createAccountsDto.name,
          createAccountsDto.balance,
          createAccountsDto.code,
          createAccountsDto.parent,
        );
      createAccountsDto.chartOfAccounting = newChartOfAccounting;
      const NewMethod = await this.accountsRepository.save(createAccountsDto);
      return NewMethod;
    } catch (error) {
      console.log(error);
      if (error.errno === 19 || error.errno === 1062)
        throw new ConflictException(
          'Account and Account number already in use',
        );
      throw new InternalServerErrorException(
        error || 'Something went wrong!🔥',
      );
    }
  }

  async findAll(): Promise<Accounts[]> {
    const result = await this.accountsRepository.find({
      relations: ['chartOfAccounting', 'chartOfAccounting.parent'],
    });
    return result;
  }

  async findOne(id: number): Promise<Accounts> {
    const found = await this.accountsRepository.findOneBy({ id });
    if (!found) throw new NotFoundException('Account is not found');
    return found;
  }

  async findOneBy(condition: any): Promise<Accounts | any> {
    const found = await this.accountsRepository.findOneBy(condition);
    if (!found) throw new NotFoundException('Account is not found');
    return found;
  }

  async update(id: number, updateAccountsDto: UpdateAccountsDto) {
    const previousAccount: Accounts = await this.findOne(id);

    const { balance: previousAmount } = previousAccount;

    const { balance: updatedAmount } = updateAccountsDto;

    const diffrence = previousAmount - updatedAmount;
    const transaction_date = new Date(Date.now()).toDateString();

    try {
      if (diffrence > 0) {
        //diffrence positive means your assets decrease. so bank account credit and opening balance equity debit
        const description = `${previousAccount.name}-Adjustment-${diffrence} taka deduction`;
        await this.transactionService.createTransactions({
          total_amount: +diffrence,
          description,
          transaction_date,
          debit_code: OPENING_BALANCE_EQUITY_CODE,
          credit_code: previousAccount.code,
          transaction_type: TransactionType.ADJUSTMENT,
        });
      } else if (diffrence < 0) {
        //diffrence negative means your assets increase. so bank account debit and opening balance equity credit
        const description = `${previousAccount.name}-Adjustment-${diffrence} taka increase`;
        await this.transactionService.createTransactions({
          total_amount: Math.abs(diffrence),
          description,
          transaction_date,
          debit_code: previousAccount.code,
          credit_code: OPENING_BALANCE_EQUITY_CODE,
          transaction_type: TransactionType.ADJUSTMENT,
        });
      }
      const account = await this.accountsRepository.update(
        id,
        updateAccountsDto,
      );
      return account;
    } catch (e) {
      if (e.errno === 19) {
        throw new ConflictException('Account number is already exists');
      }
      console.error(e);
    }
  }

  async updateBalance(id: number, balance: number) {
    await this.findOne(id);
    return await this.accountsRepository.update(id, {
      balance,
    });
  }

  async transferMoney(createTransferMoneyDto: CreateTransferMoneyDto) {
    const { fromAccount, toAccount, amount, transfer_date, transaction_type } =
      createTransferMoneyDto;

    const debit_account = await this.findOne(toAccount.id);

    const credit_account = await this.findOne(fromAccount.id);

    const debit_amount = (debit_account.balance + Number(amount)).toFixed(2);
    const credit_amount = (credit_account.balance - amount).toFixed(2);

    let description = '';
    if (transaction_type === 'TRANSFER') {
      description += `Bank Transfer from ${credit_account.name} to ${debit_account.name} amount ${amount}`;
    }
    if (transaction_type === 'WITHDRAW') {
      description += `Withdraw from ${credit_account.name}`;
    }
    if (transaction_type === 'DEPOSIT') {
      description += `Deposit to ${debit_account.name}`;
    }

    try {
      const updateDebitAccount = await this.updateBalance(
        debit_account.id,
        +debit_amount,
      );

      const updateCreditccount = await this.updateBalance(
        credit_account.id,
        +credit_amount,
      );
      const newTransaction = await this.transactionService.createTransactions({
        debit_code: debit_account.code,
        credit_code: credit_account.code,
        total_amount: +amount,
        transaction_date: transfer_date,
        description,
        transaction_type,
      });
      return newTransaction;
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong!🔥');
    }
  }

  remove(id: number) {
    return this.accountsRepository.delete(id);
  }
}
