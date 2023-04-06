import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { paginate } from 'src/common/pagination/paginate';
import { CreateTagDto } from './dto/create-tag.dto';
import { GetTagsDto } from './dto/get-tags.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';
// import tagsJson from '@db/tags.json';
import { plainToClass } from 'class-transformer';
import Fuse from 'fuse.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const options = {
  keys: ['name'],
  threshold: 0.3,
};

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag) private readonly tagRepo: Repository<Tag>,
  ) {}
  protected logger = new Logger('Tags Service');

  async create(createTagDto: CreateTagDto) {
    const { name } = createTagDto;
    createTagDto.slug = name.toLowerCase();
    try {
      return this.tagRepo.create(createTagDto);
    } catch (error) {
      this.logger.error(
        `Failed to create ${JSON.stringify(
          createTagDto,
        )} Error: ${JSON.stringify(error)}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to save data');
    }
  }

  async findAll({ page, limit, search }: GetTagsDto) {
    if (!page) page = 1;
    let data: Tag[] = await this.tagRepo.find();

    const fuse = new Fuse(data, options);

    if (search) {
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

    const url = `/tags?limit=${limit}`;
    return {
      data,
      ...paginate(data.length, page, limit, data.length, url),
    };
  }

  findOne(param: string, language: string) {
    // return this.tags.find((p) => p.id === Number(param) || p.slug === param);
  }

  update(id: number, updateTagDto: UpdateTagDto) {
    // return this.tags[0];
  }

  remove(id: number) {
    return `This action removes a #${id} tag`;
  }
}
