import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';

export class Report extends CoreEntity {
  id: number;
  user_id?: number;
  user: User[];
  model_id: number;
  model_type: string;
  message: string;
}
