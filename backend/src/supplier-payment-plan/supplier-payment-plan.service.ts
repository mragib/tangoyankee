import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { AbstractService } from 'src/common/abstract.service';
import { InjectRepository } from '@nestjs/typeorm';
import { SupplierPaymentPlan } from './entities/supplier-payment-plan.entity';
import { IsNull, LessThanOrEqual, Repository } from 'typeorm';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { CreateSupplierPaymentPlanDto } from './dto/create-supplier-payment-plan.dto';
import { UpdateSupplierPaymentPlanDto } from './dto/update-supplier-payment-plan.dto';

@Injectable()
export class SupplierPaymentPlanService extends AbstractService {
  constructor(
    @InjectRepository(SupplierPaymentPlan)
    private readonly supplierPaymentPlanRepository: Repository<SupplierPaymentPlan>,
  ) {
    super(supplierPaymentPlanRepository);
  }

  async suppliersDueDate() {
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0); // Start of the day

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999); // End of day

    const supplierPaymentDate: SupplierPaymentPlan[] =
      await this.supplierPaymentPlanRepository.find({
        relations: {
          supplier: {
            purchase: true,
            payment: true,
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

    return supplierPaymentDate.map((item) => {
      const {
        supplier: { purchase, payment, ...remainingSupplierInfo },
        ...data
      } = item;
      const payable = purchase.reduce((acc, curr) => acc + curr.totalAmount, 0);
      const paid = payment.reduce((acc, curr) => acc + curr.amountPaid, 0);

      return {
        ...data,
        supplier: { ...remainingSupplierInfo, supplier_due: payable - paid },
      };
    });
  }

  async supplierDueDate(supplier: Supplier): Promise<SupplierPaymentPlan> {
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0); // Start of the day

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999); // End of day

    const supplierPaymentDate: SupplierPaymentPlan =
      await this.supplierPaymentPlanRepository.findOne({
        where: {
          supplier,
          next_payment_date: LessThanOrEqual(endOfDay),
          paid_on: IsNull(),
        },
      });

    return supplierPaymentDate;
  }

  async updateSupplierDueDate(
    updateSupplierPaymentDto: UpdateSupplierPaymentPlanDto,
  ) {
    try {
      const { supplier, next_payment_date } = updateSupplierPaymentDto;

      const foundPreviousPaymentPlan =
        await this.supplierPaymentPlanRepository.findOne({
          where: {
            supplier: { id: supplier.id },
            paid_on: IsNull(),
          },
        });
      if (foundPreviousPaymentPlan) {
        const updatePreviousPaymentPlan =
          await this.supplierPaymentPlanRepository.update(
            {
              supplier: supplier, // Condition for the customer
              paid_on: IsNull(), // Condition for paid_on being null
            },
            {
              // Fields to update
              paid_on: new Date(), // Set `paid_on` to the current date or any other value
            },
          );
      }

      if (next_payment_date) return this.create(updateSupplierPaymentDto);
      return foundPreviousPaymentPlan;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
