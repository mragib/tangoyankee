import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
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
import { AttachmentService } from 'src/common/attachment.service';
import { User } from 'src/users/entities/user.entity';

const options = {
  keys: ['name'],
  threshold: 0.3,
};

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag) private readonly tagRepo: Repository<Tag>,
    private readonly attatchmentService: AttachmentService,
  ) {}
  protected logger = new Logger('Tags Service');

  async create(createTagDto: CreateTagDto, user: User) {
    const { name, image } = createTagDto;
    createTagDto.slug = name.toLowerCase();
    createTagDto.created_by = user;
    try {
      //Insert type settings
      if (image && Object.keys(image).length > 0) {
        const imageId = await this.attatchmentService.create({ ...image });
        createTagDto.image = imageId;
      }
      const tag = await this.tagRepo.save(createTagDto);
      return tag;
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
    let queryParam: any;

    if (!isNaN(Number(param))) {
      queryParam = { id: Number(param), language };
    } else {
      queryParam = { slug: param, language };
    }

    const found = this.tagRepo.findOne({ where: queryParam });

    if (!found) {
      throw new NotFoundException('Tag is not found');
    }
    return found;
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    const found = await this.tagRepo.findOneBy({ id });
    if (!found) {
      throw new NotFoundException('Tag is not found');
    }
    const { name, image } = updateTagDto;
    try {
      //Insert type settings
      if (image && Object.keys(image).length > 0) {
        await this.attatchmentService.update(image.id, { ...image });
      }

      updateTagDto.slug = name.toLowerCase();
      return this.tagRepo.update(id, updateTagDto);
    } catch (error) {
      this.logger.error(
        `Failed to create ${JSON.stringify(
          updateTagDto,
        )} Error: ${JSON.stringify(error)}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to save data');
    }
  }

  remove(id: number) {
    return this.tagRepo.delete(id);
  }
}
