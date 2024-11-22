import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
// import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Purchase } from './entities/purchase.entity';
import { DataSource, Repository } from 'typeorm';
import { StorageService } from 'src/storage/storage.service';
import { AbstractService } from 'src/common/abstract.service';
import { Storage } from 'src/storage/entities/storage.entity';

import { AccountsService } from 'src/accounts/accounts.service';
import { Accounts } from 'src/accounts/entities/accounts.entity';
import { TransactionsService } from 'src/transactions/transactions.service';
import {
  ACCOUNT_PAYABLE_CODE,
  ACCOUNT_RECEIVABLE_CODE,
  FINISH_GOODS_INVENTORY_ASSET_CODE,
} from 'src/common/util';
import { TransactionType } from 'src/common/common.enums';
import { SupplierPaymentPlanService } from 'src/supplier-payment-plan/supplier-payment-plan.service';
import MeiliSearch from 'meilisearch';
import { AttributeService } from 'src/attribute/attribute.service';
import { User } from 'src/user/entities/user.entity';
import { ExpenseService } from 'src/expense/expense.service';

@Injectable()
export class PurchaseService extends AbstractService {
  private meiliClient: MeiliSearch;
  constructor(
    @InjectRepository(Purchase)
    private readonly purchaseRepository: Repository<Purchase>,
    private readonly storageService: StorageService,
    private readonly accountsService: AccountsService,
    private readonly transactionService: TransactionsService,
    private readonly supplierPaymentPlanService: SupplierPaymentPlanService,
    private readonly dataSource: DataSource,
    private readonly attributeService: AttributeService,
    private readonly expenseService: ExpenseService,
  ) {
    super(purchaseRepository);
    this.meiliClient = new MeiliSearch({
      host: `${process.env.BACKEND_URL}:${process.env.SEARCH_SERVER_PORT}`,
    });
  }

  async create(createPurchaseDto: CreatePurchaseDto): Promise<Purchase | void> {
    const { supplierPaymentPlan, supplier } = createPurchaseDto;
    await this.purchaseAssciotionCreation(createPurchaseDto);
    const newPurchase = await this.dataSource.transaction(
      async (transactionalEntityManager) => {
        try {
          // Save purchase
          const purchase = await transactionalEntityManager.save(
            Purchase,
            createPurchaseDto,
          );

          return purchase;
        } catch (error) {
          console.error('Error during transaction:', error);
          throw new InternalServerErrorException('Transaction failed');
        }
      },
    );

    // Handle supplier payment plan
    if (supplierPaymentPlan) {
      await this.supplierPaymentPlanService.updateSupplierDueDate({
        next_payment_date: new Date(
          supplierPaymentPlan.next_payment_date,
        ).toDateString(),
        supplier,
      });
    }

    // if (purchaseExpense) {
    //   await this.expenseService.create(purchaseExpense);
    // }

    const index = this.meiliClient.index('global_search');
    const transformData = this.transformPurchase(newPurchase);
    await index.addDocuments([{ ...transformData, type: 'purchases' }]);

    return newPurchase;
  }

  async findAll(): Promise<Purchase[]> {
    return this.purchaseRepository.find({
      order: { purchaseDate: 'DESC', id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Purchase> {
    return await this.purchaseRepository.findOneBy({ id });
  }

  async removePurchase(id: number, user: User) {
    if (!id) {
      throw new Error(
        'PurchaseId is undefined. Ensure it is correctly assigned.',
      );
    }

    const existingPurchase = await this.purchaseRepository.findOne({
      where: { id: id },
    });

    if (!existingPurchase) {
      throw new NotFoundException(`Purchase with ID ${id} not found`);
    }

    await this.reversePurchase(existingPurchase);

    const deletedPurchase = await this.dataSource.transaction(
      async (transactionalEntityManager) => {
        await this.purchaseRepository.update(id, {
          deleted_by: user,
        });

        return await this.purchaseRepository.softDelete(id);
      },
    );

    return deletedPurchase;
  }

  async findAllForSearch() {
    const purchase = await this.purchaseRepository.find({
      relations: ['delivery'],
    });

    const transforData = purchase.map((item) => this.transformPurchase(item));

    return transforData;
  }

  transformPurchase(purchase: Purchase) {
    return {
      id: `purchase-${purchase.id}`,
      url: `purchases/${purchase.id}`,
      invoice: purchase.invoiceNumber,
      supplierPhone: purchase.supplier.phone,
      amount: purchase.totalAmount,
      delivery: purchase.delivery.deliveryStatus,
    };
  }

  async purchaseAssciotionCreation(newPurchaseData: CreatePurchaseDto) {
    const { payment, purchaseItems, invoiceNumber, totalAmount } =
      newPurchaseData;
    const purchaseDate = new Date().toDateString();
    return await this.dataSource.transaction(
      async (transactionalEntityManager) => {
        try {
          // Handle payments
          for (const item of payment) {
            const account = await this.accountsService.findOneBy({
              id: Number(item.account.id),
            });

            if (!account) throw new NotFoundException('Account not found');

            const updatedBalance =
              Number(account.balance) - Number(item.amountPaid);
            if (updatedBalance < 0) {
              throw new NotAcceptableException('Insufficient balance');
            }

            await transactionalEntityManager.update(Accounts, account.id, {
              balance: updatedBalance,
            });

            await this.transactionService.createTransactions({
              debit_code: ACCOUNT_PAYABLE_CODE,
              credit_code: account.code,
              description: `Payment for goods via ${account.name} - INVOICE-${invoiceNumber}`,
              total_amount: item.amountPaid,
              transaction_date: purchaseDate,
              transaction_type: TransactionType.PAYMENT,
            });
          }

          // Handle purchase items
          for (const item of purchaseItems) {
            const attribute = await this.attributeService.findOne({
              id: Number(item.attribute.id),
            });

            if (!attribute) throw new NotFoundException('Attribute not found');

            const currentStorage = await this.storageService.findOne({
              p_attribute: { id: attribute.id },
            });

            const updatedQuantity = currentStorage
              ? Number(currentStorage.quantity) + Number(item.quantity)
              : Number(item.quantity);

            await transactionalEntityManager.update(
              Storage,
              { p_attribute: { id: attribute.id } },
              {
                quantity: updatedQuantity,
                lot_quantity: Number(item.quantity), // Set lot quantity for new purchases
              },
            );
          }

          // Handle purchase accounting
          await this.transactionService.createTransactions({
            debit_code: FINISH_GOODS_INVENTORY_ASSET_CODE,
            credit_code: ACCOUNT_PAYABLE_CODE,
            description: `Purchase of Goods - INVOICE-${invoiceNumber}`,
            total_amount: totalAmount,
            transaction_date: purchaseDate,
            transaction_type: TransactionType.PURCHASE,
          });
        } catch (error) {
          console.error('Error during transaction:', error);
          throw new InternalServerErrorException('Transaction failed');
        }
      },
    );
  }

  async reversePurchase(existingPurchase: Purchase) {
    const reversalDate = new Date().toDateString();
    const { purchaseItems, payment, totalAmount, invoiceNumber } =
      existingPurchase;
    return await this.dataSource.transaction(
      async (transactionalEntityManager) => {
        // Reverse payments
        for (const item of payment) {
          const account = await this.accountsService.findOneBy({
            id: item.account.id,
          });
          if (!account) throw new NotFoundException('Account not found');

          const reversedBalance =
            Number(account.balance) + Number(item.amountPaid);
          await transactionalEntityManager.update(Accounts, account.id, {
            balance: reversedBalance,
          });

          await this.transactionService.createTransactions({
            debit_code: account.code,
            credit_code: ACCOUNT_PAYABLE_CODE,
            description: `Reversal of payment for purchase - INVOICE-${invoiceNumber}`,
            total_amount: item.amountPaid,
            transaction_date: reversalDate,
            transaction_type: TransactionType.REVERSAL,
          });
        }

        // Reverse inventory items
        for (const item of purchaseItems) {
          const attribute = await this.attributeService.findOne({
            id: item.attribute.id,
          });
          if (!attribute) throw new NotFoundException('Attribute not found');

          const currentStorage = await this.storageService.findOne({
            p_attribute: { id: attribute.id },
          });

          // Adjust storage quantities
          const updatedQuantity =
            Number(currentStorage.quantity) - Number(item.quantity);
          if (updatedQuantity < 0) {
            throw new ConflictException(
              `Reversal failed: insufficient quantity in storage for attribute ID ${attribute.id}`,
            );
          }
          await transactionalEntityManager.update(Storage, currentStorage.id, {
            quantity: updatedQuantity,
          });
        }

        // Reverse purchase accounting
        await this.transactionService.createTransactions({
          debit_code: ACCOUNT_PAYABLE_CODE,
          credit_code: FINISH_GOODS_INVENTORY_ASSET_CODE,
          description: `Reversal of purchase - INVOICE-${invoiceNumber}`,
          total_amount: totalAmount,
          transaction_date: reversalDate,
          transaction_type: TransactionType.REVERSAL,
        });
      },
    );
  }
}
