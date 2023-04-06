import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from 'src/users/entities/user.entity';

import { Repository } from 'typeorm';
import { JwtPayload } from './jwt-payload.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'tangooYankee51',
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    const { email } = payload;
    const user = await this.userService.findOne({ email });

    if (!user) {
      throw new UnauthorizedException();
    }

    const { password, salt, ...data } = user;

    return data;
  }
}
