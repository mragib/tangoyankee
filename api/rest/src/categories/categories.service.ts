import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoriesDto } from './dto/get-categories.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import Fuse from 'fuse.js';
//import categoriesJson from '@db/categories.json';
import { paginate } from 'src/common/pagination/paginate';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypesService } from 'src/types/types.service';
import { AttachmentService } from 'src/common/attachment.service';
import { User } from 'src/users/entities/user.entity';

const options = {
  keys: ['name', 'type.slug'],
  threshold: 0.3,
};

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    private readonly attechmentService: AttachmentService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, user: User) {
    const { name, image } = createCategoryDto;

    if (image) {
      const imageObj = await this.attechmentService.create(image);
      createCategoryDto.image = imageObj;
    }
    createCategoryDto.slug = name.toLowerCase();
    createCategoryDto.created_by = user;

    return this.categoryRepo.save(createCategoryDto);
  }

  async getCategories({ limit, page, search, parent }: GetCategoriesDto) {
    if (!page) page = 1;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let data: Category[] = await this.categoryRepo.find();
    const fuse = new Fuse(data, options);
    if (search) {
      const parseSearchParams = search.split(';');
      for (const searchParam of parseSearchParams) {
        const [key, value] = searchParam.split(':');
        // data = data.filter((item) => item[key] === value);
        data = fuse.search(value)?.map(({ item }) => item);
      }
    }
    if (parent === 'null') {
      data = data.filter((item) => item.parent === null);
    }
    const results = data.slice(startIndex, endIndex);
    const url = `/categories?search=${search}&limit=${limit}&parent=${parent}`;

    return {
      data: results,
      ...paginate(data.length, page, limit, results.length, url),
    };
  }

  async getCategory(param: string, language: string): Promise<Category> {
    let queryParam: any;

    if (!isNaN(Number(param))) {
      queryParam = { id: Number(param), language };
    } else {
      queryParam = { slug: param, language };
    }

    return await this.categoryRepo.findOne({ where: queryParam });
  }

  async findOne(id: number) {
    return await this.categoryRepo.findOneBy({ id });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto, user: User) {
    const { name, image } = updateCategoryDto;

    const prevCategory = await this.findOne(id);
    if (!prevCategory) {
      throw new NotFoundException('Category is not found');
    }

    if (image) {
      const { image: previmage } = prevCategory;
      if (previmage) {
        const imageObj = await this.attechmentService.update(
          previmage.id,
          image,
        );
        updateCategoryDto.image = imageObj;
      } else {
        const imageObj = await this.attechmentService.create(image);
        updateCategoryDto.image = imageObj;
      }
    }
    updateCategoryDto.slug = name.toLowerCase();
    updateCategoryDto.updated_by = user;
    return await this.categoryRepo.update(id, updateCategoryDto);
  }

  async remove(id: number) {
    return await this.categoryRepo.delete(id);
  }
}
