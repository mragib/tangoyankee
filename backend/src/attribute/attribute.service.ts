import { AbstractService } from 'src/common/abstract.service';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Attribute } from './entities/attribute.entity';
import { Repository } from 'typeorm';
import { TransactionsService } from 'src/transactions/transactions.service';
import {
  FINISH_GOODS_INVENTORY_ASSET_CODE,
  OPENING_BALANCE_EQUITY_CODE,
} from 'src/common/util';
import { TransactionType } from 'src/common/common.enums';
import { PurchaseItemsService } from 'src/purchase_items/purchase_items.service';
import MeiliSearch from 'meilisearch';

@Injectable()
export class AttributeService extends AbstractService {
  private meiliClient: MeiliSearch;
  constructor(
    @InjectRepository(Attribute)
    private readonly attributeRepo: Repository<Attribute>,
    private readonly transactionRepo: TransactionsService,
    private purchaseItemService: PurchaseItemsService,
  ) {
    super(attributeRepo);
    this.meiliClient = new MeiliSearch({
      host: `${process.env.BACKEND_URL}:${process.env.SEARCH_SERVER_PORT}`,
    });
  }
  async create(createAttributeDto: CreateAttributeDto) {
    try {
      // creating a unique key
      const { product, instance, storage, buyingUnitPrice } =
        createAttributeDto;

      const productName = instance.reduce(
        (acc, curr) => `${acc + curr.name}-`,
        `${product.name}-`,
      );

      const key = productName + storage.locator.name;
      const transaction_date = new Date(Date.now()).toDateString();
      createAttributeDto.sku = key.split('-').sort().join('');

      const amount = Math.ceil(buyingUnitPrice * storage.quantity);

      await this.transactionRepo.createTransactions({
        total_amount: +amount,
        description: `${productName}-opening balance`,
        transaction_date,
        debit_code: FINISH_GOODS_INVENTORY_ASSET_CODE,
        credit_code: OPENING_BALANCE_EQUITY_CODE,
        transaction_type: TransactionType.OPENING_BALANCE,
      });

      const attr = await this.attributeRepo.save(createAttributeDto);

      const index = this.meiliClient.index('global_search');
      const transformData = this.transformProduct(attr);
      await index.addDocuments([{ ...transformData, type: 'products' }]);

      return attr;
    } catch (e) {
      if (e.errno === 19 || e.errno === 1062)
        throw new ConflictException('This is already exiets');
      throw new InternalServerErrorException(e);
    }
  }

  async findAll() {
    return this.attributeRepo.find();
  }

  async update(id: number, updateAttributeDto: UpdateAttributeDto) {
    const attribute: Attribute = await this.findOne({ id });

    if (!attribute) throw new NotFoundException('Attribute is not found');

    const {
      buyingUnitPrice: previousBuyingUnitPrice,
      storage: previousStorage,
      product,
      instance,
    } = attribute;
    const { buyingUnitPrice: updatedBuyingUnitPrice } = updateAttributeDto;

    const productName = instance.reduce(
      (acc, curr) => `${acc + curr.name}-`,
      `${product.name}-`,
    );

    const previousTotalAmount =
      previousBuyingUnitPrice * previousStorage.quantity;
    const updatedTotalAmount =
      updatedBuyingUnitPrice * previousStorage.quantity;

    const diffrence = previousTotalAmount - updatedTotalAmount;
    const transaction_date = Date.now().toString();
    const description = `${productName}-Adjustment buying unit price update`;

    try {
      if (diffrence > 0) {
        //diffrence positive means inventory decrease
        await this.transactionRepo.createTransactions({
          total_amount: +diffrence,
          description,
          transaction_date,
          debit_code: OPENING_BALANCE_EQUITY_CODE,
          credit_code: FINISH_GOODS_INVENTORY_ASSET_CODE,
          transaction_type: TransactionType.ADJUSTMENT,
        });
      } else if (diffrence < 0) {
        //diffrence negative means inventory increase
        await this.transactionRepo.createTransactions({
          total_amount: Math.abs(diffrence),
          description,
          transaction_date,
          debit_code: FINISH_GOODS_INVENTORY_ASSET_CODE,
          credit_code: OPENING_BALANCE_EQUITY_CODE,
          transaction_type: TransactionType.ADJUSTMENT,
        });
      }
      const updatedAttribute = await this.attributeRepo.save({
        id,
        ...updateAttributeDto,
      });
      const updated = await this.findOne({ id });

      const index = this.meiliClient.index('global_search');
      const transformData = this.transformProduct(updated);

      await index.updateDocuments([{ ...transformData, type: 'products' }]);
      return updatedAttribute;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async getAllAttributesWithLastPurchasePrice(): Promise<any[]> {
    return await this.attributeRepo
      .createQueryBuilder('attribute')
      .leftJoin('attribute.purchaseItems', 'purchaseItem')
      .select(['attribute.id AS attributeId'])
      .addSelect(
        'COALESCE(MAX(purchaseItem.buyingUnitPrice), attribute.buyingUnitPrice)',
        'lastBuyingUnitPrice',
      )
      .groupBy('attribute.id')
      .getRawMany();
  }

  async findAllForSearch() {
    const product = await this.attributeRepo.find();

    const transforData = product.map((item) => this.transformProduct(item));

    return transforData;
  }

  transformProduct(attribute: Attribute) {
    const productInstances = attribute.instance.reduce(
      (acc, curr) => `${acc} ${curr.name}`,
      '',
    );
    return {
      id: `product-${attribute.id}`,
      name: attribute.product.name,
      instance: productInstances,
      quantity: attribute.storage.quantity,
      price: attribute.sellingUnitPrice,
    };
  }
}
