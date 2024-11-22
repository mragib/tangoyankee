import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { DailyBalance } from './entities/daily_balance.entity';
import { Between, Repository } from 'typeorm';
import { AccountsService } from 'src/accounts/accounts.service';

import { Cron, CronExpression } from '@nestjs/schedule';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { TransactionsService } from 'src/transactions/transactions.service';
import { Accounts } from 'src/accounts/entities/accounts.entity';
import { SalesItemsService } from 'src/sales_items/sales_items.service';
import { PurchaseItemsService } from 'src/purchase_items/purchase_items.service';

@Injectable()
export class DailyBalanceService {
  constructor(
    @InjectRepository(DailyBalance)
    private readonly dailyBalanceRepository: Repository<DailyBalance>,
    private readonly accountService: AccountsService,
    private readonly transactionService: TransactionsService,
    private readonly salesItemSerivce: SalesItemsService,
    private readonly purchaseItemService: PurchaseItemsService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  // @Cron(CronExpression.EVERY_10_SECONDS)
  async updateDailyBalances() {
    try {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const accounts = await this.accountService.findAll();

      const startOfDayYesterday = new Date(yesterday);
      startOfDayYesterday.setHours(0, 0, 0, 0); // Start of the yesterday

      const endOfDayYesterday = new Date(yesterday);
      endOfDayYesterday.setHours(23, 59, 59, 999); // End of yesterthe day

      const startOfDayToday = new Date(today);
      startOfDayToday.setHours(0, 0, 0, 0); // Start of the Today

      const endOfDayToday = new Date(today);
      endOfDayToday.setHours(23, 59, 59, 999); // End of Today

      for (const account of accounts) {
        const previousDayBalance = await this.dailyBalanceRepository.findOne({
          where: {
            chartOfAccounting: { id: account.chartOfAccounting.id },
            date: Between(startOfDayYesterday, endOfDayYesterday),
          },
        });

        const openingBalance = previousDayBalance
          ? previousDayBalance.closing_balance
          : account.balance;
        const closingBalance = account.balance;

        const dailyBalance = await this.dailyBalanceRepository.findOne({
          where: {
            chartOfAccounting: { id: account.chartOfAccounting.id },
            date: Between(startOfDayToday, endOfDayToday),
          },
        });

        if (dailyBalance) {
          dailyBalance.opening_balance = openingBalance;
          dailyBalance.closing_balance = closingBalance;
          await this.dailyBalanceRepository.save(dailyBalance);
        } else {
          await this.dailyBalanceRepository.save({
            date: today,
            chartOfAccounting: account.chartOfAccounting,
            opening_balance: openingBalance,
            closing_balance: closingBalance,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getIncomeStatement(startDate: Date) {
    try {
      const startOfDay = new Date(startDate);
      startOfDay.setHours(0, 0, 0, 0); // Start of the day

      const endOfDay = new Date(startDate);
      endOfDay.setHours(23, 59, 59, 999); // End of day

      const openingBalance: DailyBalance[] =
        await this.dailyBalanceRepository.findBy({
          date: Between(startOfDay, endOfDay),
        });
      const allTransactions: Transaction[] =
        await this.transactionService.getTransactionsByDate(startDate);
      const accounts: Accounts[] = await this.accountService.findAll();

      const journal = allTransactions.map((item) => item.journal).flat();

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const closingBalance = [];

      if (today.getTime() === startOfDay.getTime()) {
        closingBalance.push(
          ...accounts.map((item) => {
            return {
              date: today,
              code: item.code,
              amount: item.balance,
              account: item.name,
            };
          }),
        );
      } else {
        closingBalance.push(
          ...openingBalance.map((item) => {
            return {
              date: item.date,
              code: item.chartOfAccounting.code,
              amount: item.closing_balance,
              account: item.chartOfAccounting.name,
            };
          }),
        );
      }
      return {
        openingBalance,
        allTransactions,
        closingBalance,
        journal,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getIncomeStatementBetweenDates(startDate: Date, endDate: Date) {
    try {
      // Start of the day
      const startOfDayStartTime = new Date(startDate);
      startOfDayStartTime.setHours(0, 0, 0, 0);

      const startOfDayEndTime = new Date(startDate);
      startOfDayEndTime.setHours(23, 59, 59, 999);

      // End of day
      const endOfDayStartTime = new Date(endDate);
      endOfDayStartTime.setHours(0, 0, 0, 0);

      const endOfDayEndTime = new Date(endDate);
      endOfDayEndTime.setHours(23, 59, 59, 999);

      const openingBalance: DailyBalance[] =
        await this.dailyBalanceRepository.findBy({
          date: Between(startOfDayStartTime, startOfDayEndTime),
        });
      const allTransactions: Transaction[] =
        await this.transactionService.getTransactionsBetweenDates(
          startOfDayStartTime,
          endOfDayEndTime,
        );
      const accounts: Accounts[] = await this.accountService.findAll();

      const journal = allTransactions.map((item) => item.journal).flat();

      const today = new Date();
      today.setHours(23, 59, 59, 999);

      const closingBalance = [];

      if (today.getTime() === endOfDayEndTime.getTime()) {
        closingBalance.push(
          ...accounts.map((item) => {
            return {
              date: today,
              code: item.code,
              amount: item.balance,
              account: item.name,
            };
          }),
        );
      } else {
        const closingBalanceOfEndDate: DailyBalance[] =
          await this.dailyBalanceRepository.findBy({
            date: Between(endOfDayStartTime, endOfDayEndTime),
          });

        closingBalance.push(
          ...closingBalanceOfEndDate.map((item) => {
            return {
              date: item.date,
              code: item.chartOfAccounting.code,
              amount: item.closing_balance,
              account: item.chartOfAccounting.name,
            };
          }),
        );
      }
      return {
        openingBalance,
        allTransactions,
        closingBalance,
        journal,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getProductPurchaseSalesReport(startDate: Date, endDate: Date) {
    const startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0); // Start of the day

    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999); // End of day

    const sales = await this.salesItemSerivce.datewiseProductSales(
      startDate,
      endDate,
    );

    const purchases = await this.purchaseItemService.datewiseProductPurchase(
      startDate,
      endDate,
    );

    return {
      sales: this.transformDataSales(sales),
      purchases: this.transformDataPurchases(purchases),
    };
  }

  transformDataSales = (data) => {
    const groupedData = {};

    data.forEach((item) => {
      const date = new Date(item.salesDate).toISOString().split('T')[0]; // YYYY-MM-DD format
      if (!groupedData[date]) {
        groupedData[date] = { date };
      }
      groupedData[date][item.productName] = item.totalSalesAmount;
    });

    return Object.values(groupedData);
  };
  transformDataPurchases = (data) => {
    const groupedData = {};

    data.forEach((item) => {
      const date = new Date(item.purchaseDate).toISOString()?.split('T')[0]; // YYYY-MM-DD format
      if (!groupedData[date]) {
        groupedData[date] = { date };
      }
      groupedData[date][item.productName] = item.totalPurchasePrice;
    });

    return Object.values(groupedData);
  };
}
