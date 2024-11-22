import { PickType } from '@nestjs/swagger';

import { CreateAttributeSetDto } from './create-attribute-set.dto';
import { User } from 'src/user/entities/user.entity';
import { IsOptional } from 'class-validator';

export class UpdateAttributeSetDto extends PickType(CreateAttributeSetDto, [
  'name',
]) {
  @IsOptional()
  updated_by?: User;
}
