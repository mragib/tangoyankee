import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from 'src/auth/dto/auth-credentials.dto';

import { AbstractService } from 'src/common/abstract.service';

@Injectable()
export class UserService extends AbstractService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  async create(createUserDto: CreateUserDto) {
    const { username, password, email } = createUserDto;

    const user = await this.findOne({ username });
    if (user) {
      throw new ConflictException('Username Already exists');
    }
    const exitEmail = await this.findOne({ email });

    if (exitEmail) throw new ConflictException('Email already in use');

    const salt = await bcrypt.genSalt();
    const haspassword = await this.hashPassword(password, salt);

    createUserDto.password = haspassword;

    try {
      const newUser = await this.userRepository.save({
        ...createUserDto,
        salt,
      });

      return newUser;
    } catch (error) {
      this.logger.error(
        `Failed to create User. DTO: ${JSON.stringify(createUserDto)}`,
        error.stack,
      );
    }
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(condition): Promise<User> {
    return await this.userRepository.findOneBy(condition);
  }

  async valivateCredentials(authCredentialsDto: AuthCredentialsDto) {
    const { username, password } = authCredentialsDto;

    const user = await this.findOne({ username });

    if (!user) return null;

    if (user.isBlocked) {
      throw new UnauthorizedException('You are Blocked');
    }

    if (user && (await this.validatePassword(password, user))) {
      return user.username;
    } else {
      return null;
    }
  }

  async blockupdate(id: number, isBlocked: boolean) {
    const user = await this.findOne({ id });

    if (!user) {
      throw new NotFoundException('User not Found');
    }
    Object.assign(user, isBlocked);
    const updatedUser = await this.userRepository.save(user);

    return updatedUser;
  }

  async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async validatePassword(pass: string, user: User): Promise<boolean> {
    const { password, salt } = user;
    const hash = await bcrypt.hash(pass, salt);
    return hash === password;
  }

  async changePassword(pass: string, user: User) {
    const salt = await bcrypt.genSalt();
    const hashpassword = await this.hashPassword(pass, salt);
    const updatedUser = await this.userRepository.save({
      ...user,
      id: user.id,
      password: hashpassword,
      salt,
    });

    return updatedUser;
  }
}
