import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/role/entities/role.entity';

@Injectable()
export class UrlGuard implements CanActivate {
  constructor(private refelector: Reflector) {}
  async canActivate(context: ExecutionContext) {
    const access = this.refelector.get<string>('access', context.getHandler());
    const { user } = context.switchToHttp().getRequest();

    const role: Role = user.role;

    if (!access) {
      return true;
    }

    return role.permitted_page.some((item) => item.name === access);
  }
}
