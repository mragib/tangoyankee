import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { Type } from './entities/type.entity';

// import typesJson from '@db/types.json';
import Fuse from 'fuse.js';
import { GetTypesDto } from './dto/get-types.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttachmentService } from 'src/common/attachment.service';
import { TypeSettingsService } from './typesetting.service';
import { BannerService } from './banner.service';
import { TypeSettings } from './entities/type-settings.entity';
import { User } from 'src/users/entities/user.entity';

const options = {
  keys: ['name'],
  threshold: 0.3,
};

@Injectable()
export class TypesService {
  constructor(
    @InjectRepository(Type) private readonly typeRepo: Repository<Type>,
    private readonly attatchmentService: AttachmentService,
    private readonly typeSettingService: TypeSettingsService,
    private readonly bannerService: BannerService,
  ) {}
  protected logger = new Logger('Type Service');

  async getTypes({ text, search }: GetTypesDto) {
    let data: Type[] = await this.typeRepo.find();

    const fuse = new Fuse(data, options);

    // Check if text parameter is valid
    if (text && text.replace(/%/g, '')) {
      data = fuse.search(text).map(({ item }) => item);
    }

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
        .map(({ item }) => item);
    }

    return data;
  }

  async getTypeBySlug(slug: string): Promise<Type> {
    return await this.typeRepo.findOne({
      where: { slug },
    });
  }

  async create(createTypeDto: CreateTypeDto, user: User) {
    const { promotional_sliders, settings, banners } = createTypeDto;
    const type = plainToClass(Type, createTypeDto);
    type.created_by = user;
    try {
      const newType: Type = await this.typeRepo.save(type);

      //Insert Promotional Sliders
      if (promotional_sliders) {
        const sliders = promotional_sliders.map((item) => ({
          ...item,
          type: newType,
        }));
        for (let i = 0; i < sliders.length; i++) {
          await this.attatchmentService.create(sliders[i]);
        }
      }
      //Insert type settings
      if (settings) {
        await this.typeSettingService.create({ ...settings, type: newType });
      }

      //Insert Banner
      if (banners) {
        const sliders = banners.map((item) => ({
          ...item,
          type: newType,
        }));
        for (let i = 0; i < sliders.length; i++) {
          await this.bannerService.create(sliders[i]);
        }
      }

      return newType;
    } catch (error) {
      this.logger.error(
        `Failed to create ${JSON.stringify(
          createTypeDto,
        )} Error: ${JSON.stringify(error)}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to save data');
    }
  }

  findAll() {
    return `This action returns all types`;
  }

  async findOne(id: number) {
    return await this.typeRepo.findOneBy({ id });
  }

  async update(
    id: number,
    updateTypeDto: UpdateTypeDto,
    user: User,
  ): Promise<Type> {
    const type = await this.typeRepo.findOne({
      where: { id },
    });

    if (!type) {
      throw new NotFoundException(`Type ID: ${id} is not found`);
    }

    try {
      type.updated_by = user;
      const newType: Type = await this.typeRepo.save(type);

      // Update Promotional Sliders
      if (updateTypeDto.promotional_sliders) {
        const attachmentIds = type.promotional_sliders.map(
          (attachment) => attachment.id,
        );

        for (let i = 0; i < attachmentIds.length; i++) {
          await this.attatchmentService.remove(attachmentIds[i]);
        }

        const sliders = updateTypeDto.promotional_sliders.map((item) => ({
          ...item,
          type: newType,
        }));
        for (let i = 0; i < sliders.length; i++) {
          await this.attatchmentService.create(sliders[i]);
        }
      }

      // Update Type Settings
      if (updateTypeDto.settings) {
        const updatedSettings = plainToClass(TypeSettings, {
          ...updateTypeDto.settings,
          type: type,
        });
        await this.typeSettingService.update(
          type.settings?.id,
          updatedSettings,
        );
      }

      // Update Banners
      if (updateTypeDto.banners) {
        const bannerIds = type.banners.map((banner) => banner.id);
        for (let i = 0; i < bannerIds.length; i++) {
          await this.bannerService.remove(bannerIds[i]);
        }

        const sliders = updateTypeDto.banners.map((item) => ({
          ...item,
          type: newType,
        }));
        for (let i = 0; i < sliders.length; i++) {
          await this.bannerService.create(sliders[i]);
        }
      }

      return await this.findOne(id);
    } catch (error) {
      this.logger.error(
        `Failed to update ${JSON.stringify(
          updateTypeDto,
        )} for id ${id} Error: ${JSON.stringify(error)}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to Update data');
    }
  }

  //Delete type
  remove(id: number) {
    return this.typeRepo.delete(id);
  }
}
