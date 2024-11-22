import { Body, Controller, Post } from '@nestjs/common';

import { CreateSearchDto } from './dto/create-search.dto';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}
  @Post()
  search(@Body() searchText: CreateSearchDto) {
    return this.searchService.search(searchText.text);
  }
}
