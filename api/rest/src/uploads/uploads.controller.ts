import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Param,
  Get,
  Res,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import sharp from 'sharp';
import { join } from 'path';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { Response } from 'express';

@Controller()
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('attachments')
  @UseInterceptors(
    FilesInterceptor('attachment[]', 10, {
      storage: diskStorage({
        destination: './assets',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${Date.now()}${file.originalname}`);
        },
      }),
    }),
  )
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    const uploadedFiles = files.map((file) => {
      return {
        id: '883',
        original: `http://localhost:5000/api/${file.path}`,
        thumbnail: `http://localhost:5000/api/${file.path}`,
      };
    });

    return uploadedFiles;
  }

  @Get('assets/:path')
  async getImage(@Param('path') path, @Res() res: Response) {
    res.sendFile(path, { root: 'assets' });
  }
}
