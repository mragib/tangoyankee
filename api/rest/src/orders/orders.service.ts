import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetOrdersDto, OrderPaginator } from './dto/get-orders.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
// import ordersJson from '@db/orders.json';
// import orderStatusJson from '@db/order-statuses.json';
// import exportOrderJson from '@db/order-export.json';
// import orderInvoiceJson from '@db/order-invoice.json';
// import orderFilesJson from '@db/order-files.json';
import { plainToClass } from 'class-transformer';
import { Order } from './entities/order.entity';
import { OrderStatus } from './entities/order-status.entity';
import { paginate } from 'src/common/pagination/paginate';
import {
  GetOrderStatusesDto,
  OrderStatusPaginator,
} from './dto/get-order-statuses.dto';
import {
  CheckoutVerificationDto,
  VerifiedCheckoutData,
} from './dto/verify-checkout.dto';
import {
  CreateOrderStatusDto,
  UpdateOrderStatusDto,
} from './dto/create-order-status.dto';
import { GetOrderFilesDto } from './dto/get-downloads.dto';
import Fuse from 'fuse.js';
import { OrderFiles } from './entities/order-file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// const orders = plainToClass(Order, ordersJson);
// const orderStatus = plainToClass(OrderStatus, orderStatusJson);

const options = {
  keys: ['name'],
  threshold: 0.3,
};

// const orderFiles = plainToClass(OrderFiles, orderFilesJson);

@Injectable()
export class OrdersService {
  // private orders: Order[] = orders;
  // private orderStatus: OrderStatus[] = orderStatus;
  // private orderFiles: OrderFiles[] = orderFiles;

  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderStatus)
    private readonly orderStatusRepo: Repository<OrderStatus>,
    @InjectRepository(OrderFiles)
    private readonly orderFileRepo: Repository<OrderFiles>,
  ) {}

  async create(createOrderInput: CreateOrderDto) {
    // return await this.orderRepo.save(createOrderInput);
  }

  async getOrders({
    limit,
    page,
    customer_id,
    tracking_number,
    search,
    shop_id,
  }: GetOrdersDto): Promise<OrderPaginator> {
    if (!page) page = 1;
    if (!limit) limit = 15;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    let data: Order[] = await this.orderRepo.find();

    if (shop_id && shop_id !== 'undefined') {
      data = data?.filter((p) => p?.shop?.id === Number(shop_id));
    }
    const results = data.slice(startIndex, endIndex);
    const url = `/orders?search=${search}&limit=${limit}`;
    return {
      data: results,
      ...paginate(data.length, page, limit, results.length, url),
    };
  }

  async getOrderById(id: string): Promise<Order> {
    return await this.orderRepo.findOne({
      where: [{ id: +id }, { tracking_number: id }],
    });
  }

  async getOrderByTrackingNumber(tracking_number: string): Promise<Order> {
    console.log('t', tracking_number);
    const parentOrder = await this.orderRepo.findOneBy({ tracking_number });

    if (!parentOrder) {
      return await this.orderRepo.findOneBy({ tracking_number });
    }
    return parentOrder;
  }

  async getOrderStatuses({
    limit,
    page,
    search,
    orderBy,
  }: GetOrderStatusesDto): Promise<OrderStatusPaginator> {
    if (!page) page = 1;
    if (!limit) limit = 30;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let data: OrderStatus[] = await this.orderStatusRepo.find();

    // if (shop_id) {
    //   data = this.orders?.filter((p) => p?.shop?.id === shop_id);
    // }

    if (search) {
      const parseSearchParams = search.split(';');
      const searchText: any = [];
      const fuse = new Fuse(data, options);
      for (const searchParam of parseSearchParams) {
        const [key, value] = searchParam.split(':');
        // TODO: Temp Solution
        if (key !== 'slug') {
          searchText.push({
            [key]: value,
          });
        }
      }

      data = fuse
        .search({
          $and: searchText,
        })
        ?.map(({ item }) => item);
    }

    const results = data.slice(startIndex, endIndex);
    const url = `/order-status?search=${search}&limit=${limit}`;

    return {
      data: results,
      ...paginate(data.length, page, limit, results.length, url),
    };
  }

  getOrderStatus(param: string, language: string) {
    return this.orderStatusRepo.findBy({ slug: param });
  }

  async update(id: number, updateOrderInput: UpdateOrderDto) {
    //return await this.orderRepo.update(id, updateOrderInput);
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  verifyCheckout(input: CheckoutVerificationDto): VerifiedCheckoutData {
    return {
      total_tax: 0,
      shipping_charge: 0,
      unavailable_products: [],
      wallet_currency: 0,
      wallet_amount: 0,
    };
  }

  async createOrderStatus(createOrderStatusInput: CreateOrderStatusDto) {
    return await this.orderStatusRepo.save(createOrderStatusInput);
  }

  async updateOrderStatus(
    id: number,
    updateOrderStatusInput: UpdateOrderStatusDto,
  ) {
    return await this.orderStatusRepo.update(id, updateOrderStatusInput);
  }

  async getOrderFileItems({ page, limit }: GetOrderFilesDto) {
    if (!page) page = 1;
    if (!limit) limit = 30;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const orderFiles = await this.orderFileRepo.find();
    const results = orderFiles.slice(startIndex, endIndex);

    const url = `/downloads?&limit=${limit}`;
    return {
      data: results,
      ...paginate(orderFiles.length, page, limit, results.length, url),
    };
  }

  async getDigitalFileDownloadUrl(digitalFileId: number) {
    const item: OrderFiles = await this.orderFileRepo.findOneBy({
      digital_file_id: digitalFileId,
    });

    return item.file.url;
  }

  async exportOrder(shop_id: string) {
    //return exportOrderJson.url;
    return 'test-order-service-export-order';
  }

  async downloadInvoiceUrl(shop_id: string) {
    // return orderInvoiceJson[0].url;
    return 'test-order-service-download-order';
  }
}
