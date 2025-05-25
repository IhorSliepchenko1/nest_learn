import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guards/roles.guard';

export function JwtAuthGuard() {
     return applyDecorators(
          UseGuards(AuthGuard('jwt'), RolesGuard)
     );
}
