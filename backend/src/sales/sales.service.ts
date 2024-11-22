import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { DataSource, MoreThanOrEqual, Repository } from 'typeorm';
import { StorageService } from 'src/storage/storage.service';
import { Accounts } from 'src/accounts/entities/accounts.entity';
import { AccountsService } from 'src/accounts/accounts.service';
import { TransactionsService } from 'src/transactions/transactions.service';
import {
  ACCOUNT_RECEIVABLE_CODE,
  COST_OF_GOODS_SOLD_CODE,
  FINISH_GOODS_INVENTORY_ASSET_CODE,
  SALES_REVENUE_CODE,
} from 'src/common/util';
import { DeliveryStatus, TransactionType } from 'src/common/common.enums';

import { AttributeService } from 'src/attribute/attribute.service';
import { CustomerPaymentPlanService } from 'src/customer-payment-plan/customer-payment-plan.service';
import { PurchaseItemsService } from 'src/purchase_items/purchase_items.service';
import { PurchaseItem } from 'src/purchase_items/entities/purchase_item.entity';
import { User } from 'src/user/entities/user.entity';
import { Storage } from 'src/storage/entities/storage.entity';
import { SalesItem } from 'src/sales_items/entities/sales_item.entity';
import { SaleRevenue } from 'src/sale_revenue/entities/sale_revenue.entity';
import { AbstractService } from 'src/common/abstract.service';
import MeiliSearch from 'meilisearch';

@Injectable()
export class SalesService extends AbstractService {
  private meiliClient: MeiliSearch;
  constructor(
    @InjectRepository(Sale) private readonly saleRepository: Repository<Sale>,
    private readonly storageService: StorageService,
    private readonly accountsService: AccountsService,
    private readonly transactionService: TransactionsService,
    private readonly attributeService: AttributeService,
    private readonly cutomerPaymentPlanService: CustomerPaymentPlanService,
    private readonly purchaseItemsService: PurchaseItemsService,
    private readonly dataSource: DataSource,
  ) {
    super(saleRepository);
    this.meiliClient = new MeiliSearch({
      host: `${process.env.BACKEND_URL}:${process.env.SEARCH_SERVER_PORT}`,
    });
  }

  async create(createSaleDto: CreateSaleDto) {
    const { customerPaymentPlan, customer } = createSaleDto;
    await this.saleAssciotionCreation(createSaleDto);
    const newSale = await this.dataSource.transaction(
      async (transactionalEntityManager) => {
        try {
          // Save sale record
          const sale = await transactionalEntityManager.save(
            Sale,
            createSaleDto,
          );

          return sale;
        } catch (error) {
          console.error('Error during transaction:', error);
          throw new InternalServerErrorException('Transaction failed');
        }
      },
    );

    // Handle customer payment plan if applicable
    if (customerPaymentPlan) {
      await this.cutomerPaymentPlanService.updateCustomerDueDate({
        customer,
        next_payment_date: new Date(
          customerPaymentPlan.next_payment_date,
        ).toISOString(),
      });
    }

    const index = this.meiliClient.index('global_search');
    const transformData = this.transformSale(newSale);
    await index.addDocuments([{ ...transformData, type: 'sales' }]);

    return newSale;
  }

  findAll() {
    return this.saleRepository.find({
      relations: ['customer', 'saleItems', 'saleRevenue', 'delivery'],
      order: { salesDate: 'DESC', id: 'DESC' },
    });
  }

  async findAllDelivery(): Promise<Sale[]> {
    const today = new Date();
    return this.saleRepository.find({
      relations: ['delivery'],
      where: {
        delivery: {
          deliveryDate: MoreThanOrEqual(today),
          deliveryStatus: DeliveryStatus.OrderReceived,
        },
      },
    });
  }

  findAllSoldByUser(user: User) {
    return this.saleRepository.find({
      relations: ['customer', 'delivery', 'saleItems', 'saleRevenue'],
      where: {
        created_by: user,
      },
      order: { salesDate: 'DESC', id: 'DESC' },
    });
  }

  findOne(id: number) {
    return this.saleRepository.findOne({
      where: { id },
      relations: ['customer', 'delivery', 'saleItems', 'saleRevenue'],
    });
  }

  async update(saleId: number, updateSaleDto: UpdateSaleDto) {
    const { customerPaymentPlan, customer } = updateSaleDto;
    if (!saleId) {
      throw new Error('saleId is undefined. Ensure it is correctly assigned.');
    }
    const existingSale = await this.saleRepository.findOne({
      where: { id: saleId },
      relations: ['saleItems', 'saleRevenue'],
    });

    if (!existingSale) {
      throw new NotFoundException(`Sale with ID ${saleId} not found`);
    }

    await this.reverseSale({
      existingSale,
    });

    await this.saleAssciotionCreation(updateSaleDto);

    const updatedSale = await this.dataSource.transaction(
      async (transactionalEntityManager) => {
        try {
          updateSaleDto.invoiceNumber = existingSale.invoiceNumber;

          if (updateSaleDto.saleItems) {
            await transactionalEntityManager.delete(SalesItem, {
              sale: { id: saleId },
            });
          }
          if (updateSaleDto.saleRevenue) {
            await transactionalEntityManager.delete(SaleRevenue, {
              sale: { id: saleId },
            });
          }

          if (updateSaleDto.saleItems) {
            const newSaleItems = updateSaleDto.saleItems.map((item) => {
              const saleItem = new SalesItem();
              Object.assign(saleItem, item);
              saleItem.sale = existingSale; // Set the sale relation explicitly
              return saleItem;
            });
            await transactionalEntityManager.save(SalesItem, newSaleItems);
          }

          if (updateSaleDto.saleRevenue) {
            const newSaleRevenueItems = updateSaleDto.saleRevenue.map(
              (item) => {
                const saleRevenue = new SaleRevenue();
                Object.assign(saleRevenue, item);
                saleRevenue.sale = existingSale; // Set the sale relation explicitly
                return saleRevenue;
              },
            );
            await transactionalEntityManager.save(
              SaleRevenue,
              newSaleRevenueItems,
            );
          }

          const { saleItems, saleRevenue, ...data } = updateSaleDto;
          await transactionalEntityManager.save(
            Sale,

            { ...data, id: saleId },
          );

          const updatedSale = await this.saleRepository.findOne({
            where: { id: saleId },
            relations: ['saleItems', 'saleRevenue', 'delivery'],
          });

          return updatedSale;
        } catch (error) {
          console.error('Error during update transaction:', error);
          throw new InternalServerErrorException('Update transaction failed');
        }
      },
    );

    // Handle customer payment plan if applicable
    if (customerPaymentPlan) {
      await this.cutomerPaymentPlanService.updateCustomerDueDate({
        customer,
        next_payment_date: new Date(
          customerPaymentPlan.next_payment_date,
        ).toISOString(),
      });
    }

    const updated = await this.findOne(saleId);

    const index = this.meiliClient.index('global_search');
    const transformData = this.transformSale(updated);

    await index.updateDocuments([{ ...transformData, type: 'sales' }]);

    return updatedSale;
  }

  // async reverseSale({ existingSale, transactionalEntityManager }) {
  //   let totalCostOfGoodsSold = 0;
  //   let accountReverse, accountTransactions, storageQuantity, storageLot;
  //   const transaction_date = new Date(Date.now()).toDateString();

  //   // Reverse sale revenue
  //   for (const item of existingSale.saleRevenue) {
  //     const account = await this.accountsService.findOneBy({
  //       id: item.account.id,
  //     });
  //     if (!account) throw new NotFoundException('Account not found');

  //     const reversedBalance = account.balance - item.amountPaid;
  //     accountReverse = await transactionalEntityManager.update(
  //       Accounts,
  //       account.id,
  //       {
  //         balance: reversedBalance,
  //       },
  //     );

  //     accountTransactions = await this.transactionService.createTransactions({
  //       debit_code: ACCOUNT_RECEIVABLE_CODE,
  //       credit_code: account.code,
  //       description: `Reversal of Sales Revenue - INVOICE-${existingSale.invoiceNumber}`,
  //       total_amount: item.amountPaid,
  //       transaction_date,
  //       transaction_type: TransactionType.REVERSAL,
  //     });
  //   }

  //   // Reverse inventory and COGS for sale items
  //   for (const item of existingSale.saleItems) {
  //     const attribute = await this.attributeService.findOne({
  //       id: item.attribute.id,
  //     });
  //     if (!attribute) throw new NotFoundException('Attribute not found');

  //     let remainingQuantity = item.quantity;
  //     const storage = await this.storageService.findOne({
  //       p_attribute: { id: attribute.id },
  //     });

  //     //  Update main storage quantity to reflect full reversal
  //     const updatedQuantity = storage.quantity + item.quantity;
  //     storageQuantity = await transactionalEntityManager.update(
  //       Storage,
  //       storage.id,
  //       {
  //         quantity: updatedQuantity,
  //       },
  //     );

  //     // Step 1: Restore quantities to Purchase Items in FIFO reverse order if they exist
  //     const purchaseItems = await this.purchaseItemsService.find({
  //       where: { attribute: { id: attribute.id } },
  //       order: { created_at: 'DESC' }, // Reverse FIFO
  //     });

  //     for (const purchaseItem of purchaseItems) {
  //       if (remainingQuantity <= 0) break;

  //       const maxLotIncrease =
  //         purchaseItem.quantity - purchaseItem.lot_quantity;
  //       const lotIncrease = Math.min(remainingQuantity, maxLotIncrease);

  //       remainingQuantity -= lotIncrease;
  //       purchaseItem.lot_quantity += lotIncrease;
  //       totalCostOfGoodsSold -= lotIncrease * purchaseItem.buyingUnitPrice;

  //       await transactionalEntityManager.update(PurchaseItem, purchaseItem.id, {
  //         lot_quantity: purchaseItem.lot_quantity,
  //       });
  //     }

  //     // Step 2: If remainingQuantity is still greater than 0, reverse from Storage.lot_quantity
  //     if (remainingQuantity > 0 && storage.lot_quantity > 0) {
  //       const lotIncrease = Math.min(remainingQuantity, item.quantity); // Restore what was initially reduced
  //       remainingQuantity -= lotIncrease;
  //       storage.lot_quantity += lotIncrease;
  //       totalCostOfGoodsSold -= lotIncrease * attribute.buyingUnitPrice;

  //       storageLot = await transactionalEntityManager.update(
  //         Storage,
  //         storage.id,
  //         {
  //           lot_quantity: storage.lot_quantity,
  //         },
  //       );
  //     }
  //   }

  //   // Reverse COGS
  //   await this.transactionService.createTransactions({
  //     debit_code: FINISH_GOODS_INVENTORY_ASSET_CODE,
  //     credit_code: COST_OF_GOODS_SOLD_CODE,
  //     description: `Reversal of COGS - INVOICE-${existingSale.invoiceNumber}`,
  //     total_amount: Math.abs(totalCostOfGoodsSold),
  //     transaction_date,
  //     transaction_type: TransactionType.REVERSAL,
  //   });
  //   return { accountReverse, accountTransactions, storageQuantity, storageLot };
  // }

  async reverseSale({ existingSale }) {
    return await this.dataSource.transaction(
      async (transactionalEntityManager) => {
        let totalCostOfGoodsSold = 0;
        const transaction_date = new Date().toDateString();

        // Reverse sale revenue
        for (const item of existingSale.saleRevenue) {
          const account = await this.accountsService.findOneBy({
            id: item.account.id,
          });
          if (!account) throw new NotFoundException('Account not found');

          const reversedBalance = account.balance - item.amountPaid;
          await transactionalEntityManager.update(Accounts, account.id, {
            balance: reversedBalance,
          });

          await this.transactionService.createTransactions({
            debit_code: ACCOUNT_RECEIVABLE_CODE,
            credit_code: account.code,
            description: `Reversal of Sales Revenue - INVOICE-${existingSale.invoiceNumber}`,
            total_amount: item.amountPaid,
            transaction_date,
            transaction_type: TransactionType.REVERSAL,
          });
        }

        // Reverse inventory and COGS for sale items
        for (const item of existingSale.saleItems) {
          const attribute = await this.attributeService.findOne({
            id: item.attribute.id,
          });
          if (!attribute) throw new NotFoundException('Attribute not found');

          let remainingQuantity = item.quantity;
          const storage = await this.storageService.findOne({
            p_attribute: { id: attribute.id },
          });

          // Update main storage quantity to reflect full reversal
          const updatedQuantity = storage.quantity + item.quantity;
          await transactionalEntityManager.update(Storage, storage.id, {
            quantity: updatedQuantity,
          });

          // Restore quantities to Purchase Items in FIFO reverse order
          const purchaseItems = await this.purchaseItemsService.find({
            where: { attribute: { id: attribute.id } },
            order: { created_at: 'DESC' }, // Reverse FIFO
          });

          for (const purchaseItem of purchaseItems) {
            if (remainingQuantity <= 0) break;

            const maxLotIncrease =
              purchaseItem.quantity - purchaseItem.lot_quantity;
            const lotIncrease = Math.min(remainingQuantity, maxLotIncrease);

            remainingQuantity -= lotIncrease;
            purchaseItem.lot_quantity += lotIncrease;
            totalCostOfGoodsSold -= lotIncrease * purchaseItem.buyingUnitPrice;

            await transactionalEntityManager.update(
              PurchaseItem,
              purchaseItem.id,
              {
                lot_quantity: purchaseItem.lot_quantity,
              },
            );
          }

          // Reverse from Storage.lot_quantity if needed
          if (remainingQuantity > 0 && storage.lot_quantity > 0) {
            const lotIncrease = Math.min(remainingQuantity, item.quantity);
            storage.lot_quantity += lotIncrease;
            totalCostOfGoodsSold -= lotIncrease * attribute.buyingUnitPrice;

            await transactionalEntityManager.update(Storage, storage.id, {
              lot_quantity: storage.lot_quantity,
            });
          }
        }

        // Reverse COGS
        await this.transactionService.createTransactions({
          debit_code: FINISH_GOODS_INVENTORY_ASSET_CODE,
          credit_code: COST_OF_GOODS_SOLD_CODE,
          description: `Reversal of COGS - INVOICE-${existingSale.invoiceNumber}`,
          total_amount: Math.abs(totalCostOfGoodsSold),
          transaction_date,
          transaction_type: TransactionType.REVERSAL,
        });

        //adjust account receivable
        await this.transactionService.createTransactions({
          debit_code: SALES_REVENUE_CODE,
          credit_code: ACCOUNT_RECEIVABLE_CODE,
          description: `Reversal of Sales of Goods - INVOICE-${existingSale.invoiceNumber}`,
          total_amount: Math.abs(existingSale.totalAmount),
          transaction_date,
          transaction_type: TransactionType.SALE,
        });
      },
    );
  }

  async saleAssciotionCreation(newSaleData: CreateSaleDto) {
    const { saleItems, saleRevenue, invoiceNumber, totalAmount } = newSaleData;

    const transaction_date = new Date().toDateString();
    let totalCostOfGoodsSold = 0;

    return await this.dataSource.transaction(
      async (transactionalEntityManager) => {
        try {
          // Handle payments
          for (const item of saleRevenue) {
            const account = await this.accountsService.findOneBy({
              id: Number(item.account.id),
            });
            if (!account) throw new NotFoundException('Account not found');

            const updatedBalance =
              Number(account.balance) + Number(item.amountPaid);
            await transactionalEntityManager.update(Accounts, account.id, {
              balance: updatedBalance,
            });

            await this.transactionService.createTransactions({
              debit_code: account.code,
              credit_code: ACCOUNT_RECEIVABLE_CODE,
              description: `Sales Revenue via ${account.name} - INVOICE-${invoiceNumber}`,
              total_amount: item.amountPaid,
              transaction_date,
              transaction_type: TransactionType.RECEIPT,
            });
          }

          // Handle sale items and inventory adjustments (FIFO)
          for (const item of saleItems) {
            const attribute = await this.attributeService.findOne({
              id: item.attribute.id,
            });

            if (!attribute) throw new NotFoundException('Attribute not found');

            let remainingQuantity = item.quantity;
            const currentStorage = await this.storageService.findOne({
              p_attribute: { id: attribute.id },
            });

            // Reduce from lot quantity
            if (currentStorage.lot_quantity > 0) {
              const lotReduction = Math.min(
                remainingQuantity,
                currentStorage.lot_quantity,
              );
              remainingQuantity -= lotReduction;
              currentStorage.lot_quantity -= lotReduction;
              totalCostOfGoodsSold += lotReduction * attribute.buyingUnitPrice;

              await transactionalEntityManager.update(
                Storage,
                currentStorage.id,
                {
                  lot_quantity: currentStorage.lot_quantity,
                },
              );
            }

            // Reduce remaining from storage and purchase items (FIFO)
            if (remainingQuantity > 0) {
              const purchaseItems = await this.purchaseItemsService.find({
                where: { attribute: { id: attribute.id } },
                order: { created_at: 'ASC' },
              });

              for (const purchaseItem of purchaseItems) {
                if (remainingQuantity <= 0) break;

                const lotReduction = Math.min(
                  remainingQuantity,
                  purchaseItem.lot_quantity,
                );
                remainingQuantity -= lotReduction;
                purchaseItem.lot_quantity -= lotReduction;
                totalCostOfGoodsSold +=
                  lotReduction * purchaseItem.buyingUnitPrice;

                await transactionalEntityManager.update(
                  PurchaseItem,
                  purchaseItem.id,
                  {
                    lot_quantity: purchaseItem.lot_quantity,
                  },
                );
              }
            }

            // Update main storage quantity
            const updatedQuantity = currentStorage.quantity - item.quantity;

            await transactionalEntityManager.update(
              Storage,
              currentStorage.id,
              {
                quantity: updatedQuantity,
              },
            );
          }

          // Sales accounting
          // await this.transactionService.createSalesTransactions(
          //   totalAmount,
          //   transaction_date,
          //   invoiceNumber,
          // );

          await this.transactionService.createTransactions({
            debit_code: ACCOUNT_RECEIVABLE_CODE,
            credit_code: SALES_REVENUE_CODE,
            description: `Sales of Goods - INVOICE-${invoiceNumber}`,
            total_amount: totalAmount,
            transaction_date,
            transaction_type: TransactionType.SALE,
          });

          await this.transactionService.createTransactions({
            debit_code: COST_OF_GOODS_SOLD_CODE,
            credit_code: FINISH_GOODS_INVENTORY_ASSET_CODE,
            description: `Sales of Goods - INVOICE-${invoiceNumber}`,
            total_amount: totalCostOfGoodsSold,
            transaction_date,
            transaction_type: TransactionType.SALE,
          });
        } catch (error) {
          console.error('Error during transaction:', error);
          throw new InternalServerErrorException('Transaction failed');
        }
      },
    );
  }

  async removeSale(id: number, user: User) {
    if (!id) {
      throw new Error('saleId is undefined. Ensure it is correctly assigned.');
    }
    const existingSale = await this.saleRepository.findOne({
      where: { id: id },
      relations: ['saleItems', 'saleRevenue'],
    });

    if (!existingSale) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }
    await this.reverseSale({
      existingSale,
    });
    const deletedSale = await this.dataSource.transaction(
      async (transactionalEntityManager) => {
        await this.saleRepository.update(id, {
          deleted_by: user,
        });

        return await this.saleRepository.softDelete(id);
      },
    );

    return deletedSale;
  }

  async findAllForSearch() {
    const sales = await this.saleRepository.find({
      relations: ['delivery'],
    });

    const transforData = sales.map((item) => this.transformSale(item));

    return transforData;
  }
  transformSale(sale: Sale) {
    return {
      id: `sale-${sale.id}`,
      url: `sales/${sale.id}`,
      invoice: sale.invoiceNumber,
      customer: sale.customer.phone,
      amount: sale.totalAmount,
      delivery: sale.delivery.deliveryStatus,
    };
  }
}
