import { Module } from '@nestjs/common';
import { TypesService } from './types.service';
import { TypesController } from './types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Type } from './entities/type.entity';
import { TypeSettings } from './entities/type-settings.entity';
import { Banner } from './entities/banner.entity';
import { CommonModule } from 'src/common/common.module';
import { TypeSettingsService } from './typesetting.service';
import { BannerService } from './banner.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Type, TypeSettings, Banner]),
    CommonModule,
  ],
  controllers: [TypesController],
  providers: [TypesService, TypeSettingsService, BannerService],
})
export class TypesModule {}
