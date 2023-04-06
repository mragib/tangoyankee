import { PartialType } from '@nestjs/swagger';
import { CreatePermitedPagesDto } from './create-permitedPages.dto';

export class UpdatepermitedPagesDto extends PartialType(
  CreatePermitedPagesDto,
) {}
