import { Body, Controller, Patch, Req, UploadedFile, UseFilters, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { ChangeOwnPasswordDto } from './dto/change-own-password.dto';
import { Request } from 'express';
import { changePasswordAsAdminDto } from './dto/change-password-as-admin.dto';
import { UploadFileInterceptor } from 'src/uploads/interceptors/upload-file.interceptor';
import { createMulterFilter } from 'src/uploads/filters/multer-exception.filter';
import { UpdateUserRolesDto } from './dto/update-user-roles.dto';
import { AuthRoles } from 'src/auth/decorators/auth-roles.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,) { }

  @AuthRoles('ADMIN')
  @Patch('change-admin-password')
  async adminChangeUserPassword(@Body() dto: changePasswordAsAdminDto) {
    return await this.userService.changePasswordAsAdmin(dto)
  }

  @AuthRoles('*')
  @Patch('change-own-password')
  async changeOwnPassword(@Req() req: Request, @Body() dto: ChangeOwnPasswordDto) {
    return await this.userService.changeOwnPassword(req, dto)
  }

  @AuthRoles('*')
  @Patch('avatar')
  @UseInterceptors(UploadFileInterceptor(['image/jpeg', 'image/png'], 2, 'avatar'))
  @UseFilters(createMulterFilter('2MB'))
  async changeAvatar(@Req() req: Request, @UploadedFile() file: Express.Multer.File) {
    return await this.userService.changeAvatar(req, file)
  }

  @AuthRoles('ADMIN')
  @Patch('update-user-roles')
  async updateUserRoles(@Body() dto: UpdateUserRolesDto) {
    return await this.userService.updateUserRoles(dto)
  }
}
