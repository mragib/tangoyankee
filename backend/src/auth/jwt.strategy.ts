import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from './jwt-payload.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {
    const config = configService.get('app_config');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.SECRETKEY,
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    const { username } = payload;

    if (!username) throw new UnauthorizedException('username is not asign');
    const user: User = await this.userRepository.findOneByOrFail({
      username,
    });

    if (!user) {
      throw new UnauthorizedException('user is not found');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, salt, ...data } = user;

    return {
      id: data.id,
      username: data.username,
      role: data.role, // Pass the role as it is to make sure RolesGuard can use it
    };
  }
}
