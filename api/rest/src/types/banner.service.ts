import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { AttachmentService } from 'src/common/attachment.service';
import { Repository } from 'typeorm';
import { CreateBannerDto } from './dto/create-banner.dto';
import { Banner } from './entities/banner.entity';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(Banner) private readonly bannerRepo: Repository<Banner>,
    private readonly attatchmentService: AttachmentService,
  ) {}

  async create(createBannerDto: CreateBannerDto): Promise<Banner> {
    const { image } = createBannerDto;
    const banner = plainToClass(Banner, createBannerDto);

    const newBanner = await this.bannerRepo.save(banner);

    if (image) {
      await this.attatchmentService.create({
        ...image,
        banner: newBanner,
      });
    }

    return banner;
  }

  async update(id: number, data: any) {
    try {
      const file = await this.bannerRepo.update(id, data);
      return file;
    } catch (e) {
      throw new InternalServerErrorException('update falied');
    }
  }

  async remove(id: number) {
    return await this.bannerRepo.delete(id);
  }
}
