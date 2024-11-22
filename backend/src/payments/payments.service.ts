import {
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { CreatePaymentFromSupplier } from './dto/create-payment-from-supplier.dto';
import { AccountsService } from 'src/accounts/accounts.service';
import { Accounts } from 'src/accounts/entities/accounts.entity';
import { TransactionType } from 'src/common/common.enums';
import { ACCOUNT_PAYABLE_CODE } from 'src/common/util';
import { TransactionsService } from 'src/transactions/transactions.service';
import { SupplierPaymentPlanService } from 'src/supplier-payment-plan/supplier-payment-plan.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private accountsService: AccountsService,
    private readonly transactionService: TransactionsService,
    private readonly supplierPaymentPlanService: SupplierPaymentPlanService,
  ) {}
  async create(createPaymentDto: CreatePaymentDto) {
    const { purchase, account, amountPaid, supplier, supplierPaymentPlan } =
      createPaymentDto;
    const id = Number(account.id);

    try {
      await this.supplierPaymentPlanService.updateSupplierDueDate({
        supplier,
        next_payment_date: supplierPaymentPlan
          ? new Date(supplierPaymentPlan.next_payment_date).toDateString()
          : undefined,
      });
      const selectedPaymentMethod: Accounts =
        await this.accountsService.findOneBy({
          id,
        });

      const { balance: prevAmount } = selectedPaymentMethod;

      if (+prevAmount <= +amountPaid)
        throw new NotAcceptableException('You dont have enough money');

      const updatedAmount = Number(prevAmount) - Number(amountPaid);
      await this.accountsService.updateBalance(id, updatedAmount);
      const transaction_date = new Date(Date.now()).toDateString();
      this.transactionService.createTransactions({
        debit_code: ACCOUNT_PAYABLE_CODE,
        credit_code: selectedPaymentMethod.code,
        description: `Supplier payment for INVOICE-${purchase.invoiceNumber} via ${selectedPaymentMethod.name}`,
        total_amount: amountPaid,
        transaction_type: TransactionType.PAYMENT,
        transaction_date,
      });

      const purchasePayment =
        await this.paymentRepository.save(createPaymentDto);
      return purchasePayment;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll() {
    return await this.paymentRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }

  async makePaymentFromSupplier(
    paymentFromSupplierDto: CreatePaymentFromSupplier,
  ) {
    const {
      purchasesWithDues,
      payable,
      supplier,
      account,
      cheque_number,
      supplierPaymentPlan,
      created_by,
    } = paymentFromSupplierDto;

    let remainingBalance = payable;
    let i = 0;
    let invoice = '';
    try {
      await this.supplierPaymentPlanService.updateSupplierDueDate({
        supplier,
        next_payment_date: supplierPaymentPlan
          ? new Date(supplierPaymentPlan.next_payment_date).toDateString()
          : undefined,
      });
      while (remainingBalance > 0 && i < purchasesWithDues.length) {
        const totalPayable =
          purchasesWithDues[i].totalAmount - purchasesWithDues[i].amountPaid;
        const paymentDate = new Date(purchasesWithDues[i].purchaseDate);

        if (totalPayable < remainingBalance) {
          const newPayment: CreatePaymentDto = {
            purchaseId: purchasesWithDues[i].purchaseId,
            paymentDate,
            amountPaid: totalPayable,
            supplierId: supplier.id,
            account,
            cheque_number,
            created_by,
          };
          remainingBalance -= totalPayable;

          await this.paymentRepository.save(newPayment);

          invoice += purchasesWithDues[i].invoiceNumber;
        } else {
          const newPayment: CreatePaymentDto = {
            purchaseId: purchasesWithDues[i].purchaseId,
            paymentDate,
            amountPaid: remainingBalance,
            supplierId: supplier.id,
            account,
            cheque_number,
            created_by,
          };
          remainingBalance = 0;

          await this.paymentRepository.save(newPayment);

          invoice += purchasesWithDues[i].invoiceNumber;
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

      const balance = Number(prevAmount) - Number(payable);

      await this.accountsService.updateBalance(id, balance);

      const transaction_date = new Date(Date.now()).toDateString();
      const description = `Supplier ${supplier.name} payment for INVOICE-${invoice} via ${prevPaymentMethod.name}`;

      this.transactionService.createTransactions({
        debit_code: ACCOUNT_PAYABLE_CODE,
        credit_code: prevPaymentMethod.code,
        description,
        total_amount: payable,
        transaction_type: TransactionType.PAYMENT,
        transaction_date,
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
