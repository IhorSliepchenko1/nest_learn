import { UseGuards, applyDecorators } from '@nestjs/common';
import { RolesGuard } from '../guards/roles.guard';
import { JwtGuard } from '../guards/jwt.guard';

export function JwtAuthGuard() {
     return applyDecorators(
          UseGuards(JwtGuard, RolesGuard)
     );
}
