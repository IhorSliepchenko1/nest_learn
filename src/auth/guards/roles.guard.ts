import {
     Injectable,
     CanActivate,
     ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/use-roles.decorator';
import { Request } from 'express';
import { User } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
     constructor(private reflector: Reflector) { }

     canActivate(context: ExecutionContext): boolean {

          const requiredRoles = this.reflector.getAllAndOverride<string[]>
               (ROLES_KEY, [
                    context.getHandler(),
                    context.getClass(),
               ]);

          if (!requiredRoles || requiredRoles.length === 0) {
               return true;
          }

          const { user } = context.switchToHttp().getRequest() as Request

          return requiredRoles.includes((user as User)?.role);
     }
}
