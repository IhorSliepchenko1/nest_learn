import { Body, Controller, Patch, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ChangeUserPasswordByAdminDto } from './dto/change-user-password-by-admin.dto';
import { ChangeOwnPasswordDto } from './dto/change-own-password.dto';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }
  
  @JwtAuthGuard()
  @Roles('ADMIN')
  @Patch('change-admin-password')
  async adminChangeUserPassword(@Body() dto: ChangeUserPasswordByAdminDto) {
    return await this.userService.adminChangeUserPassword(dto)
  }

  @JwtAuthGuard()
  @Patch('change-own-password')
  async changeOwnPassword(@Req() req: Request, @Body() dto: ChangeOwnPasswordDto) {
    return await this.userService.changeOwnPassword(req, dto)
  }
}
