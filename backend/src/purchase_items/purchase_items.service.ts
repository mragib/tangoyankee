import { Injectable } from '@nestjs/common';
import { CreatePurchaseItemDto } from './dto/create-purchase_item.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseItem } from './entities/purchase_item.entity';
import { QueryRunner, Repository } from 'typeorm';
import { Purchase } from 'src/purchase/entities/purchase.entity';
import { Attribute } from 'src/attribute/entities/attribute.entity';
import { Product } from 'src/product/entities/product.entity';
import { UpdatePurchaseItemsLotQuantity } from './dto/update-purchase_items_lot_quantity.dto';

@Injectable()
export class PurchaseItemsService {
  constructor(
    @InjectRepository(PurchaseItem)
    private readonly purchaseItemRepository: Repository<PurchaseItem>,
  ) {}
  create(createPurchaseItemDto: CreatePurchaseItemDto) {
    return this.purchaseItemRepository.save(createPurchaseItemDto);
  }

  async findAll() {
    return await this.purchaseItemRepository.find();
  }

  async find(condition) {
    return this.purchaseItemRepository.find(condition);
  }

  async updateQuantity(
    id: number,
    updatePurchaseItemsLotQuantity: UpdatePurchaseItemsLotQuantity,
    queryRunner?: QueryRunner,
  ) {
    if (queryRunner) {
      // Use queryRunner's manager to update if it's provided
      return await queryRunner.manager.update(
        PurchaseItem,
        id,
        updatePurchaseItemsLotQuantity,
      );
    } else {
      // Fallback to normal repository update if no QueryRunner is passed
      return await this.purchaseItemRepository.update(
        id,
        updatePurchaseItemsLotQuantity,
      );
    }
  }

  async findProductBuyingPrice() {
    return await this.purchaseItemRepository
      .createQueryBuilder('pi')
      .innerJoin(
        (qb) =>
          qb
            .select('attributeId')
            .addSelect('MAX(created_at)', 'created')
            .from(PurchaseItem, 'subPi')
            .groupBy('attributeId'),
        's',
        's.attributeId = pi.attributeId AND s.created = pi.created_at',
      )
      .select(['pi.attributeId', 'pi.buyingUnitPrice'])
      .getRawMany();
  }

  async datewiseProductPurchase(startDate: Date, endDate: Date) {
    const dbType = this.purchaseItemRepository.manager.connection.options.type;

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

    const result = await this.purchaseItemRepository
      .createQueryBuilder('pi')
      .select('DATE(pr.purchaseDate)', 'purchaseDate') // Include the sales date truncated to the day
      .addSelect('ai.id', 'attributeId')
      .addSelect('p.name', 'productName')
      .addSelect(groupConcatFunction, 'instanceNames') // Ensure distinct instances
      .addSelect('SUM(pi.quantity * pi.buyingUnitPrice)', 'totalPurchasePrice')
      .where('pr.purchaseDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .innerJoin(Purchase, 'pr', 'pi.purchaseId = pr.id')
      .innerJoin(Attribute, 'ai', 'ai.id = pi.attributeId')
      .innerJoin(Product, 'p', 'p.id = ai.productId') // Assuming attribute has a productId
      .leftJoin('ai.instance', 'i') // Join with instances (if needed)
      .groupBy('DATE(pr.purchaseDate)') // Group by the sales date
      .addGroupBy('pi.attributeId') // Group by the product attribute ID
      .orderBy('pr.purchaseDate', 'ASC') // Optional: order by sales date
      .getRawMany();

    result.forEach((row) => {
      // Create product name without repeating instances
      row.productName = `${row.productName}${row.instanceNames ? '--' + row.instanceNames.replace(/\s+/g, '') : ''}`;
    });

    return result;
  }

  async getLastPurchaseItem(attributeId: number): Promise<PurchaseItem | null> {
    return await this.purchaseItemRepository.findOne({
      where: { attribute: { id: attributeId } },
      order: { created_at: 'DESC' },
    });
  }
}
