import { Controller, Get, Query } from '@nestjs/common';
import { DailyBalanceService } from './daily_balance.service';

@Controller()
export class DailyBalanceController {
  constructor(private readonly dailyBalanceService: DailyBalanceService) {}
  @Get('dailty-statement')
  async dailyIncomeStatement(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    if (startDate && endDate) {
      // If both startDate and endDate are provided, return transactions between those dates
      return this.dailyBalanceService.getIncomeStatementBetweenDates(
        new Date(startDate),
        new Date(endDate),
      );
    } else if (startDate) {
      // If only startDate is provided, return transactions for that date
      return this.dailyBalanceService.getIncomeStatement(new Date(startDate));
    }
    return this.dailyBalanceService.getIncomeStatement(new Date(startDate));
  }

  @Get('purchase-sales-report')
  async productPurchaseSalesReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.dailyBalanceService.getProductPurchaseSalesReport(
      new Date(startDate),
      new Date(endDate),
    );
  }
}
