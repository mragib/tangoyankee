import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import {
  AuthCredentialsDto,
  ChangePasswordDto,
} from './dto/auth-credentials.dto';

import { JwtPayload } from './jwt-payload.interface';
import { TokenService } from 'src/token/token.service';
import { Request, Response } from 'express';
import { MoreThanOrEqual } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
  ) {}
  async create(createAuthDto: CreateUserDto) {
    return await this.userService.create(createAuthDto);
  }

  async signin(
    authCredentialsDto: AuthCredentialsDto,
    response,
  ): Promise<{ token: string; user: any }> {
    const config = this.configService.get('app_config');

    const username =
      await this.userService.valivateCredentials(authCredentialsDto);

    if (!username) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const user = await this.userService.findOne({ username });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { salt, password, ...data } = user;

    const payload: JwtPayload = { username, userId: data.id, role: data.role };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: config.ACCESS_TOKEN_VALIDITY_DURATION_IN_SEC,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: config.REFRESH_TOKEN_VALIDITY_DURATION_IN_SEC,
    });

    const expiredAt = new Date();
    expiredAt.setDate(expiredAt.getDate() + 7); // Refresh token valid for 7 days

    await this.tokenService.save({
      user_id: data.id,
      token: refreshToken,
      expired_at: expiredAt,
    });

    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      // sameSite: 'None',
    });

    return { token: accessToken, user: data };
  }

  async authUser(request: Request) {
    try {
      const accessToken = request.headers.authorization.replace('Bearer ', '');

      const { userId } = await this.jwtService.verifyAsync(accessToken);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, isBlocked, salt, ...data } =
        await this.userService.findOne({ id: userId });

      return data;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async refreshToken(request: Request, response: Response) {
    try {
      const refreshToken = request.cookies['refresh_token'];

      // Check if the refresh token is present
      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token is missing');
      }

      // Verify the refresh token and extract the payload
      const payload = await this.jwtService.verifyAsync(refreshToken);

      const { userId, username, role } = payload;

      // Check if the token exists in the database and is not expired
      const entityToken = await this.tokenService.findOne({
        user_id: userId,
        expired_at: MoreThanOrEqual(new Date()),
      });

      if (!entityToken) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      const config = this.configService.get('app_config');
      // Generate a new access token
      const accessToken = await this.jwtService.signAsync(
        { username, userId, role },
        {
          expiresIn: config.ACCESS_TOKEN_VALIDITY_DURATION_IN_SEC,
        },
      );

      response.status(200);
      // Set the new access token in the response
      return { token: accessToken };
    } catch (error) {
      // Respond with a generic unauthorized error
      throw new UnauthorizedException('Unable to refresh token');
    }
  }

  async logout(request: Request, response: Response) {
    const refreshToken = request.cookies['refresh_token'];
    try {
      const { user_id } = await this.tokenService.findOne({
        token: refreshToken,
      });

      await this.tokenService.delete({ user_id });
      response.clearCookie('refresh_token');
    } catch (error) {}

    return {
      message: 'success',
    };
  }

  async changePassword(
    changePasswordDto: ChangePasswordDto,
    user: User,
    response,
  ) {
    const { old_password, new_password } = changePasswordDto;
    const { username } = user;

    const foundUser = await this.userService.valivateCredentials({
      username,
      password: old_password,
    });
    if (!foundUser) {
      throw new UnauthorizedException('Invalid Password');
    }
    const updatedUser = await this.userService.changePassword(
      new_password,
      user,
    );

    await this.signin(
      {
        username: updatedUser.username,
        password: new_password,
      },
      response,
    );

    return updatedUser;
  }
}
