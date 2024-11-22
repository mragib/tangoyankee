import { Injectable } from '@nestjs/common';
import { CreateSalesItemDto } from './dto/create-sales_item.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { SalesItem } from './entities/sales_item.entity';
import { Repository } from 'typeorm';
import { Sale } from 'src/sales/entities/sale.entity';
import { Attribute } from 'src/attribute/entities/attribute.entity';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class SalesItemsService {
  constructor(
    @InjectRepository(SalesItem)
    private readonly salesItemsRepository: Repository<SalesItem>,
  ) {}
  create(createSalesItemDto: CreateSalesItemDto) {
    return this.salesItemsRepository.save({ ...createSalesItemDto });
  }

  findAll() {
    return this.salesItemsRepository.find();
  }
  async datewiseProductSales(startDate: Date, endDate: Date) {
    const dbType = this.salesItemsRepository.manager.connection.options.type;

    let groupConcatFunction = '';

    if (dbType === 'mysql' || dbType === 'mariadb') {
      // Use MySQL/MariaDB specific GROUP_CONCAT
      groupConcatFunction =
        "GROUP_CONCAT(DISTINCT i.name ORDER BY i.name SEPARATOR ',')";
    } else if (dbType === 'postgres') {
      // Use PostgreSQL specific string_agg
      groupConcatFunction = "string_agg(DISTINCT i.name, ',')";
    } else if (dbType === 'sqlite') {
      // SQLite also supports GROUP_CONCAT, but without the SEPARATOR
      groupConcatFunction = 'GROUP_CONCAT(DISTINCT i.name)';
    } else {
      throw new Error(`Unsupported database type: ${dbType}`);
    }
    const result = await this.salesItemsRepository
      .createQueryBuilder('si')
      .select('DATE(sl.salesDate)', 'salesDate') // Include the sales date truncated to the day
      .addSelect('ai.id', 'attributeId')
      .addSelect('p.name', 'productName')
      .addSelect(groupConcatFunction, 'instanceNames') // Dynamic function based on DB
      .addSelect('SUM(si.quantity * si.sellingUnitPrice)', 'totalSalesAmount')
      .where('sl.salesDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .innerJoin(Sale, 'sl', 'si.saleId = sl.id')
      .innerJoin(Attribute, 'ai', 'ai.id = si.attributeId')
      .innerJoin(Product, 'p', 'p.id = ai.productId') // Assuming attribute has a productId
      .leftJoin('ai.instance', 'i') // Join with instances (if needed)
      .groupBy('DATE(sl.salesDate)') // Group by the sales date
      .addGroupBy('si.attributeId') // Group by the product attribute ID
      .orderBy('sl.salesDate', 'ASC') // Optional: order by sales date
      .getRawMany();

    result.forEach((row) => {
      // Create product name without repeating instances
      row.productName = `${row.productName}${row.instanceNames ? '--' + row.instanceNames.replace(/\s+/g, '') : ''}`;
    });

    return result;
  }
}
