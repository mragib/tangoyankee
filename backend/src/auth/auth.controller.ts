import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';

import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import {
  AuthCredentialsDto,
  ChangePasswordDto,
} from './dto/auth-credentials.dto';
import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GetUser } from './decorators/get-user.decorator';
import { User } from 'src/user/entities/user.entity';

@ApiTags('Auth')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @Public()
  create(@Body() createAuthDto: CreateUserDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  @Public()
  signin(
    @Body() createAuthDto: AuthCredentialsDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.signin(createAuthDto, response);
  }

  @Post('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @GetUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.changePassword(changePasswordDto, user, response);
  }

  @Get('auth-user')
  async user(@Req() request: Request) {
    return await this.authService.authUser(request);
  }

  @Post('refresh')
  @Public()
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.refreshToken(request, response);
  }

  @Post('logout')
  @Public()
  async logout(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    return await this.authService.logout(request, response);
  }
}
