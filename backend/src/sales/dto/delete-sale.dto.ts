import { IsEmpty } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class DeleteSaleDto {
  @IsEmpty()
  deleted_by: User;
}
