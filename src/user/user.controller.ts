import { Body, Controller, Patch, Req, UploadedFile, UseFilters, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { ChangeOwnPasswordDto } from './dto/change-own-password.dto';
import { Request } from 'express';
import { ChangePasswordAsAdminDto } from './dto/change-password-as-admin.dto';
import { UploadFileInterceptor } from 'src/uploads/interceptors/upload-file.interceptor';
import { createMulterFilter } from 'src/uploads/filters/multer-exception.filter';
import { UpdateUserRolesDto } from './dto/update-user-roles.dto';
import { AuthRoles } from 'src/auth/decorators/auth-roles.decorator';
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateRoleResponse } from './dto/update-role.dto';

@ApiTags('User')
@ApiBearerAuth('jwt-token')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,) { }

  @ApiOperation({
    summary: "Изменение пароля (admin)",
    description: "Роут для изменения пароля администратором любому пользователю с младшей ролью"
  })
  @ApiOkResponse({
    description: "true"
  })
  @ApiNotFoundResponse({
    description: "Пользователь не найден"
  })
  @ApiBadRequestResponse({
    description: "Ошибка ввода пароля"
  })
  @AuthRoles('ADMIN')
  @Patch('change-admin-password')
  async adminChangeUserPassword(@Body() dto: ChangePasswordAsAdminDto) {
    return await this.userService.changePasswordAsAdmin(dto)
  }

  @ApiOperation({
    summary: "Изменение пароля (own)",
    description: "Роут для изменения пароля для текущего пользователя"
  })
  @ApiOkResponse({
    description: "true"
  })
  @ApiNotFoundResponse({
    description: "Пользователь не найден"
  })
  @ApiBadRequestResponse({
    description: "Ошибка ввода пароля"
  })
  @AuthRoles('*')
  @Patch('change-own-password')
  async changeOwnPassword(@Req() req: Request, @Body() dto: ChangeOwnPasswordDto) {
    return await this.userService.changeOwnPassword(req, dto)
  }


  @ApiOperation({
    summary: "Изменение аватара",
    description: "Редактирование фото аватара пользователя"
  })
  @ApiOkResponse({
    description: "true"
  })
  @ApiNotFoundResponse({
    description: "Пользователь не найден"
  })
  @AuthRoles('*')
  @Patch('avatar')
  @UseInterceptors(UploadFileInterceptor(['image/jpeg', 'image/png'], 2, 'avatar'))
  @UseFilters(createMulterFilter('2MB'))
  async changeAvatar(@Req() req: Request, @UploadedFile() file: Express.Multer.File) {
    return await this.userService.changeAvatar(req, file)
  }

  @ApiOperation({
    summary: "Редактирование ролей полльзователя",
    description: "Добавление или удаление ролей для пользователя"
  })
  @ApiOkResponse({
    type: UpdateRoleResponse
  })
  @ApiNotFoundResponse({
    description: "Пользователь не найден"
  })
  @ApiConflictResponse({
    description: "Некоторые роли не существуют: ..."
  })
  @ApiBadRequestResponse({
    description: "Новые роли не добавлены, так как они уже присутствуют"
  })
  @AuthRoles('ADMIN')
  @Patch('update-user-roles')
  async updateUserRoles(@Body() dto: UpdateUserRolesDto) {
    return await this.userService.updateUserRoles(dto)
  }
}
