import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  NotFoundException,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

@ApiTags('Users')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('upload-profile-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/profile-images';

          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const imageName = file.originalname.split('.')[0];
          const fileExt = extname(file.originalname); // Get the file extension
          const newFilename = `${imageName}${fileExt}`; // Construct the new filename
          cb(null, newFilename); // Use the new filename
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const filePath = `/uploads/profile-images/${file.filename}`;

    try {
      return {
        message: 'Image uploaded successfully',
        path: filePath,
      };
    } catch (error) {
      return { message: 'Error processing Image file', error };
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'owner')
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const found = await this.userService.findOne({ id });

    if (!found) {
      throw new NotFoundException('User is not found');
    }

    return found;
  }

  @Patch('profile')
  updateProfile(@Body() updateUserDto: UpdateUserDto, @GetUser() user: User) {
    return this.userService.update(user.id, updateUserDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Patch('block/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  blockUser(@Param('id') id: string, @Body() isBlocked: boolean) {
    return this.userService.blockupdate(+id, isBlocked);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
