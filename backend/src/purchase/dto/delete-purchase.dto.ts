import { IsEmpty } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class DeletePurchaseDto {
  @IsEmpty()
  deleted_by: User;
}
