import { IsNumberString, IsOptional } from 'class-validator';

export class CreateJournalDto {
  @IsOptional()
  @IsNumberString()
  cr_amount?: number;

  @IsOptional()
  @IsNumberString()
  dr_amount?: number;
}
