import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  NotFoundException,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';

import { ApiTags } from '@nestjs/swagger';
import { CreateAccountsDto } from './dto/create-accounts.dto';
import { UpdateAccountsDto } from './dto/update-accounts.dto';
import { CreateTransferMoneyDto } from './dto/create-transfer-money.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/user/entities/user.entity';

@ApiTags('Accounts')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @Roles('admin', 'owner')
  create(@Body() createAccountsDto: CreateAccountsDto, @GetUser() user: User) {
    createAccountsDto.created_by = user;
    return this.accountsService.createPayment(createAccountsDto);
  }

  @Post('transfer')
  @Roles('admin', 'owner')
  transferMoney(
    @Body() createTransferMoneyDto: CreateTransferMoneyDto,
    @GetUser() user: User,
  ) {
    createTransferMoneyDto.created_by = user;
    return this.accountsService.transferMoney(createTransferMoneyDto);
  }

  @Get()
  @Roles('admin', 'owner', 'manager', 'sales')
  findAll() {
    return this.accountsService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'owner', 'manager')
  async findOne(@Param('id') id: string) {
    const found = await this.accountsService.findOne(+id);
    if (!found) throw new NotFoundException('Payment method is not found');
    return found;
  }

  @Patch(':id')
  @Roles('admin', 'owner')
  update(
    @Param('id') id: string,
    @Body() updateAccountsDto: UpdateAccountsDto,
    @GetUser() user: User,
  ) {
    updateAccountsDto.updated_by = user;
    return this.accountsService.update(+id, updateAccountsDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.paymentMethodService.remove(+id);
  // }
}
