import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('expense')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  @Roles('admin', 'owner', 'manager')
  create(@Body() createExpenseDto: CreateExpenseDto, @GetUser() user: User) {
    createExpenseDto.created_by = user;
    return this.expenseService.create(createExpenseDto);
  }

  @Get()
  @Roles('admin', 'owner', 'manager')
  findAll() {
    return this.expenseService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'owner', 'manager')
  async findOne(@Param('id') id: string) {
    const found = await this.expenseService.findOne(+id);

    if (!found) throw new NotFoundException('Expense is not found');
    return found;
  }

  @Patch(':id')
  @Roles('admin', 'owner', 'manager')
  update(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @GetUser() user: User,
  ) {
    updateExpenseDto.updated_by = user;
    return this.expenseService.update(+id, updateExpenseDto);
  }

  @Delete(':id')
  @Roles('admin', 'owner')
  remove(@Param('id') id: string) {
    return this.expenseService.remove(+id);
  }
}
