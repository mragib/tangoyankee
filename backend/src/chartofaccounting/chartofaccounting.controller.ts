import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ChartofaccountingService } from './chartofaccounting.service';
import { CreateChartofaccountingDto } from './dto/create-chartofaccounting.dto';
import { UpdateChartofaccountingDto } from './dto/update-chartofaccounting.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('chartofaccounting')
export class ChartofaccountingController {
  constructor(
    private readonly chartofaccountingService: ChartofaccountingService,
  ) {}

  @Post()
  create(@Body() createChartofaccountingDto: CreateChartofaccountingDto) {
    return this.chartofaccountingService.create(createChartofaccountingDto);
  }

  @Get()
  findAll() {
    return this.chartofaccountingService.findAll();
  }
  @Get('report')
  amount() {
    return this.chartofaccountingService.calculate();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const found = await this.chartofaccountingService.findOne({ id });
    if (!found) throw new NotFoundException('Chart of accounting is not found');
    return found;
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChartofaccountingDto: UpdateChartofaccountingDto,
  ) {
    return this.chartofaccountingService.update(
      +id,
      updateChartofaccountingDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chartofaccountingService.remove(+id);
  }

  @Post('upload-csv')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Path where files will be temporarily stored
        filename: (req, file, cb) => {
          const fileExtName = extname(file.originalname);
          const randomName = Array(12)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${fileExtName}`);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const filePath = `./uploads/${file.filename}`;
    try {
      await this.chartofaccountingService.parseCsvAndInsertData(filePath);
      return {
        message: 'CSV uploaded and data inserted successfully',
        status: true,
      };
    } catch (error) {
      return { message: 'Error processing CSV file', error, status: false };
    }
  }
}
