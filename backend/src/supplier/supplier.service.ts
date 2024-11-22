import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from './entities/supplier.entity';
import { UpdateSupplierStatusDto } from './dto/update-supplier-status.dto';
import MeiliSearch from 'meilisearch';

@Injectable()
export class SupplierService {
  private meiliClient: MeiliSearch;
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
  ) {
    this.meiliClient = new MeiliSearch({
      host: `${process.env.BACKEND_URL}:${process.env.SEARCH_SERVER_PORT}`,
    });
  }
  async create(createSupplierDto: CreateSupplierDto) {
    try {
      const newSupplier = await this.supplierRepository.save(createSupplierDto);
      const index = this.meiliClient.index('global_search');
      const transformData = this.transformSupplier(newSupplier);
      await index.addDocuments([{ ...transformData, type: 'suppliers' }]);
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  async findAll() {
    const suppliers = await this.supplierRepository
      .createQueryBuilder('supplier')

      .leftJoinAndSelect('supplier.purchase', 'purchase')
      .leftJoinAndSelect('supplier.payment', 'payment')

      .getMany(); // Use getMany to retrieve an array of results

    return suppliers;
  }

  async findOne(id: number) {
    const suppliers = await this.supplierRepository
      .createQueryBuilder('supplier')

      .leftJoinAndSelect('supplier.purchase', 'purchase')
      .leftJoinAndSelect('supplier.payment', 'payment')
      .where('supplier.id = :id', { id })
      .getOne(); // Use getMany to retrieve an array of results

    return suppliers;
  }

  async update(id: number, updateSupplierDto: UpdateSupplierDto) {
    const found = await this.findOne(id);

    if (!found) {
      throw new NotFoundException('Supplier is not found.');
    }
    const updatedSupplier = await this.supplierRepository.save({
      ...updateSupplierDto,
      id,
    });
    const index = this.meiliClient.index('global_search');
    const transformData = this.transformSupplier(updatedSupplier);
    await index.updateDocuments([{ ...transformData, type: 'suppliers' }]);

    return updatedSupplier;
  }

  async updateStatus(
    id: number,
    updateSupplierStatusDto: UpdateSupplierStatusDto,
  ) {
    return await this.supplierRepository.update(id, updateSupplierStatusDto);
  }

  async remove(id: number) {
    return await this.supplierRepository.delete(id);
  }

  async findAllForSearch() {
    const suppliers = await this.supplierRepository.find();
    const transformData = suppliers.map((item) => this.transformSupplier(item));
    return transformData;
  }

  transformSupplier(supplier: Supplier) {
    return {
      id: `supplier-${supplier.id}`,
      url: `people/supplier/${supplier.id}`,
      name: supplier.name,
      phone: supplier.phone,
      address: supplier.address,
      owner: supplier.owner,
    };
  }
}
