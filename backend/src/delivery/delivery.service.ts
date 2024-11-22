import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Delivery } from './entities/delivery.entity';
import { IsNull, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { DeliveryStatus } from 'src/common/common.enums';
import { Sale } from 'src/sales/entities/sale.entity';
import MeiliSearch from 'meilisearch';

@Injectable()
export class DeliveryService extends AbstractService {
  private meiliClient: MeiliSearch;
  constructor(
    @InjectRepository(Delivery)
    private readonly deliveryRepository: Repository<Delivery>,
  ) {
    super(deliveryRepository);
    this.meiliClient = new MeiliSearch({
      host: `${process.env.BACKEND_URL}:${process.env.SEARCH_SERVER_PORT}`,
    });
  }

  async findAll(): Promise<Delivery[]> {
    const today = new Date();

    return this.deliveryRepository.find({
      relations: {
        sale: {
          customer: true,
        },
      },
      where: [
        {
          deliveryDate: MoreThanOrEqual(today),
          sale: { id: Not(IsNull()) },
        },
        {
          deliveryStatus: DeliveryStatus.OrderReceived,
          sale: { id: Not(IsNull()) },
        },
      ],
    });
  }

  async create(createDeliveryDto: CreateDeliveryDto): Promise<Delivery> {
    try {
      return this.deliveryRepository.save(createDeliveryDto);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async update(id: number, updateDeliveryDto: UpdateDeliveryDto) {
    const found = await this.findOne({ id });
    if (!found) throw new NotFoundException('Delivery is not found');

    await this.deliveryRepository.update(id, updateDeliveryDto);

    const updated = await this.findOne({ id });

    const transforData = this.transformSale({
      ...updated.sale,
      delivery: updated,
    });

    const index = this.meiliClient.index('global_search');

    await index.updateDocuments([{ ...transforData, type: 'sales' }]);

    return updated;
  }
  transformSale(sale: Sale) {
    return {
      id: `sale-${sale.id}`,
      url: `sales/${sale.id}`,
      invoice: sale.invoiceNumber,
      customer: sale.customer.phone,
      amount: sale.totalAmount,
      delivery: sale.delivery.deliveryStatus,
    };
  }
}
