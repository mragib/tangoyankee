import { CoreEntity } from '../../common/entities/core.entity';
import { Attachment } from '../../common/entities/attachment.entity';

import { Type } from '../../types/entities/type.entity';
import { ShopSocials } from 'src/settings/entities/shopSocials.entity';

export class Manufacturer extends CoreEntity {
  id: number;
  cover_image?: Attachment;
  description?: string;
  image?: Attachment;
  is_approved?: boolean;
  name: string;
  products_count?: number;
  slug?: string;
  socials?: ShopSocials;
  type: Type;
  type_id?: string;
  website?: string;
  language?: string;
  translated_languages?: string[];
}
