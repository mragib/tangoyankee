import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  createProductTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.createTransactions(createTransactionDto);
  }

  @Get()
  async findAll(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    if (startDate && endDate) {
      // If both startDate and endDate are provided, return transactions between those dates
      return this.transactionsService.getTransactionsBetweenDates(
        new Date(startDate),
        new Date(endDate),
      );
    } else if (startDate) {
      // If only startDate is provided, return transactions for that date
      return this.transactionsService.getTransactionsByDate(
        new Date(startDate),
      );
    }
    // Optionally handle the case where no date is provided

    return this.transactionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const found = await this.transactionsService.findOne(+{ id });

    if (!found) throw new NotFoundException('Transaction is not found');

    return found;
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateTransactionDto: UpdateTransactionDto,
  // ) {
  //   return this.transactionsService.update(+id, updateTransactionDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(+id);
  }

  // @Get()
  // async getTransactions(
  //   @Query('startDate') startDate?: string,
  //   @Query('endDate') endDate?: string
  // ) {
  //   if (startDate && endDate) {
  //     // If both startDate and endDate are provided, return transactions between those dates
  //     return this.transactionsService.getTransactionsBetweenDates(new Date(startDate), new Date(endDate));
  //   } else if (startDate) {
  //     // If only startDate is provided, return transactions for that date
  //     return this.transactionsService.getTransactionsByDate(new Date(startDate));
  //   }
  //   // Optionally handle the case where no date is provided
  //   return this.transactionsService.getAllTransactions();
  // }
}
