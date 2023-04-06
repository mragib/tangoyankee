import { PickType } from '@nestjs/swagger';
import { ConnectBelongsTo } from '../entities/contact-entity';
import { Profile } from '../entities/profile.entity';

export class CreateProfileDto extends PickType(Profile, [
  'avatar',
  'bio',
  'socials',
  'contact',
]) {
  customer: ConnectBelongsTo;
}
