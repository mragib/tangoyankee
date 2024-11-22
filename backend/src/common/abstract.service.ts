import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { paginatedResult } from './paginated-result.interace';
// import MeiliSearch from 'meilisearch';

@Injectable()
export abstract class AbstractService {
  // private meiliClient: MeiliSearch;
  constructor(protected readonly repository: Repository<any>) {
    // this.meiliClient = new MeiliSearch({
    //   host: `${process.env.BACKEND_URL}:${process.env.SEARCH_SERVER_PORT}`,
    // });
  }

  protected logger = new Logger(`${this.repository.target} Service`);

  async findAll(): Promise<any[]> {
    return await this.repository.find();
  }

  async pagination(page = 1, relations = []): Promise<paginatedResult> {
    const take = 3;

    const [data, total] = await this.repository.findAndCount({
      take,
      skip: (page - 1) * take,
      relations,
    });

    return {
      data: data,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / take),
      },
    };
  }

  async create(data): Promise<any> {
    try {
      const savedData = await this.repository.save(data);

      return savedData;
    } catch (error) {
      console.log(error);
      if (error.errno === 19 || error.errno === 1062)
        throw new ConflictException('This should be an unique');

      this.logger.error(
        `Failed to create ${JSON.stringify(data)} Error: ${JSON.stringify(
          error,
        )}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to save data');
    }
  }

  async findOne(condition): Promise<any> {
    const data = await this.repository.findOneBy(condition);

    return data;
  }

  async update(id: number, data): Promise<any> {
    const found = await this.findOne({ id });

    if (!found) {
      throw new NotFoundException('Data Not Found');
    }
    try {
      await this.repository.update(id, data);
      return await this.findOne({ id });
    } catch (error) {
      if (error.errno === 19 || error.errno === 1062)
        throw new ConflictException('This should be an unique');
      this.logger.error(
        `Failed to update ${JSON.stringify(
          data,
        )} for id ${id} Error: ${JSON.stringify(error)}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to Update data');
    }
  }

  async remove(id: number): Promise<any> {
    const data = await this.findOne({ id });
    if (!data) {
      throw new NotFoundException('Data Not Found');
    }
    try {
      await this.repository.delete(id);

      return 'Successfully Deleted';
    } catch (error) {
      this.logger.error(
        `Failed to delete ${JSON.stringify(data)} for id ${id}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to Delete');
    }
  }

  // getClient() {
  //   return this.meiliClient;
  // }
}
