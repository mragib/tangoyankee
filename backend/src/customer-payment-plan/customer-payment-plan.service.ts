import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { CustomerPaymentPlan } from './entities/customer-payment-plan.entity';
import { IsNull, LessThanOrEqual, Repository } from 'typeorm';

import { UpdateCustomerPaymentPlanDto } from './dto/update-customer-payment-plan.dto';

@Injectable()
export class CustomerPaymentPlanService extends AbstractService {
  constructor(
    @InjectRepository(CustomerPaymentPlan)
    private readonly customerPaymentPlanRepository: Repository<CustomerPaymentPlan>,
  ) {
    super(customerPaymentPlanRepository);
  }

  async customersDueDate() {
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0); // Start of the day

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999); // End of day

    const customerPaymentDate: CustomerPaymentPlan[] =
      await this.customerPaymentPlanRepository.find({
        relations: {
          customer: {
            sale: true,
            saleRevenue: true,
          },
        },
        where: {
          next_payment_date: LessThanOrEqual(endOfDay),
          paid_on: IsNull(),
        },
        order: {
          next_payment_date: 'DESC',
        },
      });

    return customerPaymentDate.map((item) => {
      const {
        customer: { sale, saleRevenue, ...remainingCustomerInfo },
        ...data
      } = item;
      const payable = sale.reduce((acc, curr) => acc + curr.totalAmount, 0);
      const paid = saleRevenue.reduce((acc, curr) => acc + curr.amountPaid, 0);

      return {
        ...data,
        customer: { ...remainingCustomerInfo, customer_due: payable - paid },
      };
    });
  }

  async updateCustomerDueDate(
    updateCustomerPaymentDto: UpdateCustomerPaymentPlanDto,
  ) {
    try {
      const { customer, next_payment_date } = updateCustomerPaymentDto;

      const foundPreviousPaymentPlan =
        await this.customerPaymentPlanRepository.findOne({
          where: {
            customer: { id: customer.id },
            paid_on: IsNull(),
          },
        });
      if (foundPreviousPaymentPlan) {
        const updatePreviousPaymentPlan =
          await this.customerPaymentPlanRepository.update(
            {
              customer: customer, // Condition for the customer
              paid_on: IsNull(), // Condition for paid_on being null
            },
            {
              // Fields to update
              paid_on: new Date(), // Set `paid_on` to the current date or any other value
            },
          );
      }

      if (next_payment_date) return this.create(updateCustomerPaymentDto);
      return foundPreviousPaymentPlan;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
