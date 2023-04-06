import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersDto, UserPaginator } from './dto/get-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import Fuse from 'fuse.js';

import { User } from './entities/user.entity';
import usersJson from '@db/users.json';
import { paginate } from 'src/common/pagination/paginate';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { Repository } from 'typeorm';
import { LoginDto, RegisterDto } from 'src/auth/dto/create-auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  protected logger = new Logger(`${this.userRepo.target} Service`);

  create(createUserDto: CreateUserDto) {
    return this.userRepo.save(createUserDto);
  }

  async register(createUserDto: RegisterDto) {
    const { email, password } = createUserDto;

    const user = await this.findOne({ email });
    if (user) {
      throw new ConflictException('Email Already exists');
    }

    const salt = await bcrypt.genSalt();

    const haspassword = await this.hashPassword(password, salt);

    createUserDto.password = haspassword;
    let newUser: User;
    const roleid = [4];
    try {
      newUser = await this.userRepo.save({
        ...createUserDto,
        salt,
      });
    } catch (error) {
      this.logger.error(
        `Failed to create User. DTO: ${JSON.stringify(createUserDto)}`,
        error.stack,
      );
    }
    return newUser;
  }

  async findOne(condition): Promise<User> {
    return await this.userRepo.findOneBy(condition);
  }

  async getUsers({
    text,
    limit,
    page,
    search,
  }: GetUsersDto): Promise<UserPaginator> {
    if (!page) page = 1;
    if (!limit) limit = 30;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let data: User[] = await this.userRepo.find();
    const options = {
      keys: ['name', 'type.slug', 'categories.slug', 'status'],
      threshold: 0.3,
    };
    const fuse = new Fuse(data, options);

    if (text?.replace(/%/g, '')) {
      data = fuse.search(text)?.map(({ item }) => item);
    }

    if (search) {
      const [key, value] = search.split(':');
      const searchQuery = {
        [key]: value,
      };
      data = fuse.search(searchQuery)?.map(({ item }) => item);
    }

    const results = data.slice(startIndex, endIndex);
    const url = `/users?limit=${limit}`;

    return {
      data: results,
      ...paginate(data.length, page, limit, results.length, url),
    };
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepo.update(id, updateUserDto);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async makeAdmin(user_id: string) {
    const user = await this.userRepo.findOneBy({ id: +user_id });

    user.roleId = 1;

    return await this.userRepo.update(+user_id, user);
  }

  async banUser(id: number) {
    const user = await this.userRepo.findOneBy({ id });

    user.is_active = !user.is_active;

    return await this.userRepo.update(id, user);
  }

  async activeUser(id: number) {
    const user = await this.userRepo.findOneBy({ id });

    user.is_active = !user.is_active;

    return await this.userRepo.update(id, user);
  }
  async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async validatePassword(pass: string, user: User): Promise<boolean> {
    const { password, salt } = user;
    const hash = await bcrypt.hash(pass, salt);
    return hash === password;
  }

  // sign in
  async valivateCredentials(authCredentialsDto: LoginDto) {
    const { email, password } = authCredentialsDto;

    const user = await this.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    if (!user.is_active) {
      throw new UnauthorizedException('You are Blocked');
    }

    if (user && (await this.validatePassword(password, user))) {
      return user.email;
    } else {
      return null;
    }
  }

  find() {
    return this.userRepo.find();
  }
}
