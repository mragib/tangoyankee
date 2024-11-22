import {
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { Repository } from 'typeorm';
import { TransactionsService } from 'src/transactions/transactions.service';
import { TransactionType } from 'src/common/common.enums';
import { Accounts } from 'src/accounts/entities/accounts.entity';
import { AccountsService } from 'src/accounts/accounts.service';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    private readonly transactionService: TransactionsService,
    private readonly accountsService: AccountsService,
  ) {}
  async create(createExpenseDto: CreateExpenseDto) {
    const { debit_account, credit_account, amount, description, expenseDate } =
      createExpenseDto;

    try {
      const id = Number(credit_account.id);

      const selectedPaymentMethod: Accounts =
        await this.accountsService.findOneBy({
          id,
        });

      const { balance: prevAmount } = selectedPaymentMethod;

      if (prevAmount <= amount)
        throw new NotAcceptableException('You dont have enough money');

      const updatedAmount = Number(prevAmount) - Number(amount);
      await this.accountsService.updateBalance(id, updatedAmount);
      const newTransaction = await this.transactionService.createTransactions({
        credit_code: selectedPaymentMethod.code,
        debit_code: debit_account,
        description,
        transaction_date: expenseDate,
        total_amount: amount,
        transaction_type: TransactionType.EXPENSE,
      });
      createExpenseDto.transaction = newTransaction;
      return this.expenseRepository.save(createExpenseDto);
    } catch (error) {
      if (error.status === 406)
        throw new NotAcceptableException('You dont have enough money');
      throw new InternalServerErrorException(
        error.response.message || 'Something went wrong!!!',
      );
    }
  }

  findAll() {
    return this.expenseRepository.find();
  }

  findOne(id: number) {
    return this.expenseRepository.findOneBy({ id });
  }

  async update(id: number, updateExpenseDto: UpdateExpenseDto) {
    const expense = await this.findOne(id);
    if (!expense) throw new NotFoundException('This expense is not found');
    return this.expenseRepository.save({ ...updateExpenseDto, id });
  }

  remove(id: number) {
    return `This action removes a #${id} expense`;
  }
}
