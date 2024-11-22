import { ConflictException, Injectable } from '@nestjs/common';

import { AbstractService } from 'src/common/abstract.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService extends AbstractService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {
    super(productRepository);
  }
  async create(createProductDto: CreateProductDto): Promise<any> {
    const { name } = createProductDto;

    const product = await this.findOne({ name });
    if (product) {
      throw new ConflictException('Product Already exists');
    }

    return this.productRepository.save(createProductDto);
  }
}
