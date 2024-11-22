import { PartialType } from '@nestjs/swagger';
import { CreateInstanceDto } from './create-instance.dto';
import { AttributeSet } from 'src/attribute-set/entities/attribute-set.entity';
import { User } from 'src/user/entities/user.entity';
import { IsOptional } from 'class-validator';

export class UpdateInstanceDto extends PartialType(CreateInstanceDto) {
  @IsOptional()
  updated_by?: User;
}
