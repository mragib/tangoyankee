import { PartialType, PickType } from '@nestjs/swagger';
import { CreateLocatorDto } from './create-locator.dto';
import { IsOptional } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class UpdateLocatorDto extends PartialType(
  PickType(CreateLocatorDto, ['name', 'status']),
) {
  @IsOptional()
  updated_by: User;
}
