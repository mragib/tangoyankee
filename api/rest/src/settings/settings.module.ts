import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactDetails } from './entities/contactDetails.entity';
import { DeliveryTime } from './entities/deliveryTime.entity';
import { FacebookSettings } from './entities/facebookSettings.entity';
import { GoogleSettings } from './entities/googleSetting.entity';
import { SeoSettings } from './entities/seoSettings.entity';
import { Setting } from './entities/setting.entity';
import { SettingsOptions } from './entities/settingsOptions.entity';
import { ShopSocials } from './entities/shopSocials.entity';
import { Location } from './entities/location.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Setting,
      SeoSettings,
      SettingsOptions,
      DeliveryTime,

      GoogleSettings,
      FacebookSettings,
      ContactDetails,
      ShopSocials,
      Location,
    ]),
  ],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
