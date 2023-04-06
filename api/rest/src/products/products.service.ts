import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductsDto, ProductPaginator } from './dto/get-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { paginate } from 'src/common/pagination/paginate';
import Fuse from 'fuse.js';
import { GetPopularProductsDto } from './dto/get-popular-products.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const options = {
  keys: [
    'name',
    'type.slug',
    'categories.slug',
    'status',
    'shop_id',
    'author.slug',
    'tags',
    'manufacturer.slug',
  ],
  threshold: 0.3,
};

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    return await this.productRepo.save(createProductDto);
  }

  async getProducts({
    limit,
    page,
    search,
  }: GetProductsDto): Promise<ProductPaginator> {
    if (!page) page = 1;
    if (!limit) limit = 30;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    let data: Product[] = await this.productRepo.find();
    console.log('test2');
    if (search) {
      const fuse = new Fuse(data, options);
      const parseSearchParams = search.split(';');
      const searchText: any = [];
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
    const url = `/products?search=${search}&limit=${limit}`;
    return {
      data: results,
      ...paginate(data.length, page, limit, results.length, url),
    };
  }

  async getProductBySlug(slug: string) {
    const product = await this.productRepo.findOne({ where: { slug } });
    const related_products: Product[] = await this.productRepo.find();
    const products = related_products
      .filter((p) => p.type.slug === product.type.slug)
      .slice(0, 20) as Product[];
    return {
      ...product,
      related_products: products,
    };
  }

  async getPopularProducts({
    limit,
    type_slug,
  }: GetPopularProductsDto): Promise<Product[]> {
    let data: any = await this.productRepo.find();
    if (type_slug) {
      const fuse = new Fuse(data, options);
      data = fuse.search(type_slug)?.map(({ item }) => item);
    }
    return data?.slice(0, limit);
  }
  async findOne(condition): Promise<any> {
    const data = await this.productRepo.findOneBy(condition);

    return data;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne({ id });
    if (!product) {
      throw new NotFoundException('Product is not found');
    }
    try {
      await this.productRepo.update(id, updateProductDto);
      return await this.findOne({ id });
    } catch (error) {
      throw new InternalServerErrorException('Failed to Update data');
    }
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
