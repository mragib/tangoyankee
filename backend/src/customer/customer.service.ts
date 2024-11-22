import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Like, Repository } from 'typeorm';
import { UpdateCustomerStatus } from './dto/update-customer-status.dto';
import MeiliSearch from 'meilisearch';

@Injectable()
export class CustomerService {
  private meiliClient: MeiliSearch;
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {
    this.meiliClient = new MeiliSearch({
      host: `${process.env.BACKEND_URL}:${process.env.SEARCH_SERVER_PORT}`,
    });
  }
  async create(createCustomerDto: CreateCustomerDto) {
    const { phone } = createCustomerDto;

    // Check if a user with the given phone number already exists (including soft-deleted users)
    const existingUser = await this.customerRepository.findOne({
      withDeleted: true,
      where: { phone },
    });
    const index = this.meiliClient.index('global_search');

    if (existingUser) {
      // Attempt to restore the soft-deleted user
      try {
        const restoredUser =
          await this.customerRepository.recover(existingUser);

        const transformCustomer = this.transformCustomer(restoredUser);
        await index.updateDocuments([
          { ...transformCustomer, type: 'customers' },
        ]);
        return restoredUser;
      } catch (error) {
        console.error('Failed to restore soft-deleted user:', error);
        throw new BadRequestException(
          'There was an issue restoring the user.🔥',
        );
      }
    }

    // If the user doesn't exist, attempt to create a new user
    try {
      const newUser = await this.customerRepository.save({
        ...createCustomerDto,
      });
      const transformCustomer = this.transformCustomer(newUser);
      await index.addDocuments([{ ...transformCustomer, type: 'customers' }]);
      return newUser;
    } catch (e) {
      // Handle other errors
      if (e.errno === 19) {
        // Handle unique constraint violation if needed
        throw new BadRequestException(
          'User with the same phone number already exists.',
        );
      } else {
        // Handle other errors
        console.error('Unexpected error during user creation:', e);
        throw new BadRequestException('There is something wrong.🔥');
      }
    }
  }

  async findAll() {
    const customers = await this.customerRepository
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.sale', 'sale')
      .leftJoinAndSelect('customer.saleRevenue', 'saleRevenue')
      .getMany(); // Use getMany to retrieve an array of results

    return customers;
  }

  async findAllByPhone(phone_number: string) {
    try {
      const customers = await this.customerRepository.find({
        where: {
          phone: Like(`%${phone_number}%`),
        },
        take: 10, // Retrieve only the first 10 records
      });

      return customers;
    } catch (e) {
      console.log(e);
    }
  }

  async findOneById(id: number) {
    const customer = await this.customerRepository
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.sale', 'sale')
      .leftJoinAndSelect('customer.saleRevenue', 'saleRevenue')

      .where('customer.id = :id', { id })
      .getOne(); // Use getMany to retrieve an array of results

    return customer;
  }

  async findOneByPhone(phone: string) {
    const customer = await this.customerRepository.findOneBy({
      phone,
    });
    return customer;
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    const found = await this.findOneById(id);

    if (!found) {
      throw new NotFoundException('Customer is not found.');
    }
    const updatedCustomer = await this.customerRepository.save({
      ...updateCustomerDto,
      id,
    });

    const index = this.meiliClient.index('global_search');
    const transformCustomer = this.transformCustomer(updatedCustomer);
    await index.updateDocuments([{ ...transformCustomer, type: 'customers' }]);

    return updatedCustomer;
  }

  async updateStatus(id: number, updateCustomerStatus: UpdateCustomerStatus) {
    return await this.customerRepository.update(id, updateCustomerStatus);
  }

  remove(id: number) {
    return this.customerRepository.delete(id);
  }

  async findAllForSearch() {
    const customers = await this.customerRepository.find();
    const transformData = customers.map((item) => this.transformCustomer(item));
    return transformData;
  }

  transformCustomer(customer: Customer) {
    return {
      id: `customer-${customer.id}`,
      url: `people/customer/${customer.id}`,

      name: customer.name,
      phone: customer.phone,
      address: customer.address,
    };
  }
}
