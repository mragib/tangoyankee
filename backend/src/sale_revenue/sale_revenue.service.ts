import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateSaleRevenueDto } from './dto/create-sale_revenue.dto';
import { UpdateSaleRevenueDto } from './dto/update-sale_revenue.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SaleRevenue } from './entities/sale_revenue.entity';
import { Repository } from 'typeorm';
import { CreatePaymentFromCustomerDto } from './dto/create-payment-from-customer.dto';
import { Accounts } from 'src/accounts/entities/accounts.entity';
import { AccountsService } from 'src/accounts/accounts.service';
import { TransactionsService } from 'src/transactions/transactions.service';
import { ACCOUNT_RECEIVABLE_CODE } from 'src/common/util';
import { TransactionType } from 'src/common/common.enums';
import { CustomerPaymentPlanService } from 'src/customer-payment-plan/customer-payment-plan.service';

@Injectable()
export class SaleRevenueService {
  constructor(
    @InjectRepository(SaleRevenue)
    private readonly saleRepository: Repository<SaleRevenue>,
    private readonly accountsService: AccountsService,
    private readonly transactionService: TransactionsService,
    private readonly customerPaymentPlanService: CustomerPaymentPlanService,
  ) {}

  async create(
    createSaleRevenueDto: CreateSaleRevenueDto,
  ): Promise<SaleRevenue> {
    const { sale, account, amountPaid, customerPaymentPlan, customer } =
      createSaleRevenueDto;

    try {
      await this.customerPaymentPlanService.updateCustomerDueDate({
        customer,
        next_payment_date: customerPaymentPlan
          ? new Date(customerPaymentPlan.next_payment_date).toDateString()
          : undefined,
      });
      const id = Number(account.id);
      const prevPaymentMethod: Accounts = await this.accountsService.findOneBy({
        id,
      });

      if (!prevPaymentMethod)
        throw new NotFoundException('Account is not found');

      const { balance: prevAmount } = prevPaymentMethod;

      const balance = Number(prevAmount) + Number(amountPaid);

      await this.accountsService.updateBalance(id, balance);

      const transaction_date = new Date(Date.now()).toDateString();

      this.transactionService.createTransactions({
        debit_code: prevPaymentMethod.code,
        credit_code: ACCOUNT_RECEIVABLE_CODE,
        description: `Customer payment for INVOICE-${sale.invoiceNumber} via ${prevPaymentMethod.name} - `,
        total_amount: amountPaid,
        transaction_type: TransactionType.RECEIPT,
        transaction_date,
      });
      const saleRevenue = await this.saleRepository.save(createSaleRevenueDto);
      return saleRevenue;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Something went wrong!!!');
    }
  }

  async payFromCustomer(
    createPaymentFromCustomerDto: CreatePaymentFromCustomerDto,
  ) {
    const {
      saleWithDues,
      payable,
      customer,
      account,
      cheque_number,
      customerPaymentPlan,
      created_by,
    } = createPaymentFromCustomerDto;

    let remainingBalance = payable;
    let i = 0;
    let invoice = '';
    try {
      await this.customerPaymentPlanService.updateCustomerDueDate({
        customer,
        next_payment_date: customerPaymentPlan
          ? new Date(customerPaymentPlan.next_payment_date).toDateString()
          : undefined,
      });

      while (remainingBalance > 0 && i < saleWithDues.length) {
        const totalPayable =
          saleWithDues[i].totalAmount - saleWithDues[i].amountPaid;
        const paymentDate = new Date(saleWithDues[i].salesDate);

        if (totalPayable < remainingBalance) {
          const newPayment: CreateSaleRevenueDto = {
            saleId: saleWithDues[i].saleId,
            paymentDate,
            amountPaid: totalPayable,
            customerId: customer.id,
            account,
            cheque_number,
            created_by,
          };
          remainingBalance -= totalPayable;

          const revenue = await this.saleRepository.save(newPayment);
          invoice += saleWithDues[i].invoiceNumber;
        } else {
          const newPayment: CreateSaleRevenueDto = {
            saleId: saleWithDues[i].saleId,
            paymentDate,
            amountPaid: remainingBalance,
            customerId: customer.id,
            account,
            cheque_number,
            created_by,
          };
          remainingBalance = 0;
          const revenue = await this.saleRepository.save(newPayment);
          invoice += saleWithDues[i].invoiceNumber;
        }

        i++;
      }

      const id = Number(account.id);
      const prevPaymentMethod: Accounts = await this.accountsService.findOneBy({
        id,
      });

      if (!prevPaymentMethod)
        throw new NotFoundException('Account is not found');

      const { balance: prevAmount } = prevPaymentMethod;

      const balance = Number(prevAmount) + Number(payable);

      await this.accountsService.updateBalance(id, balance);

      const transaction_date = new Date(Date.now()).toDateString();
      const description = `Customer ${customer.name} payment for INVOICE-${invoice} via ${prevPaymentMethod.name}`;

      this.transactionService.createTransactions({
        debit_code: prevPaymentMethod.code,
        credit_code: ACCOUNT_RECEIVABLE_CODE,
        description,
        total_amount: payable,
        transaction_type: TransactionType.RECEIPT,
        transaction_date,
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  findAll() {
    return this.saleRepository.find();
  }

  findOne(id: number) {
    return this.saleRepository.findOneBy({ id });
  }

  update(id: number, updateSaleRevenueDto: UpdateSaleRevenueDto) {
    return `This action updates a #${id} saleRevenue`;
  }

  remove(id: number) {
    return `This action removes a #${id} saleRevenue`;
  }
}
