import { Module } from '@nestjs/common';
import { AttributeSetService } from './attribute-set.service';
import { AttributeSetController } from './attribute-set.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttributeSet } from './entities/attribute-set.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AttributeSet])],
  controllers: [AttributeSetController],
  providers: [AttributeSetService],
  exports: [AttributeSetService],
})
export class AttributeSetModule {}
