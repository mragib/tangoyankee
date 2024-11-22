import { PartialType } from '@nestjs/swagger';
import { CreateChartofaccountingDto } from './create-chartofaccounting.dto';

export class UpdateChartofaccountingDto extends PartialType(
  CreateChartofaccountingDto,
) {}
