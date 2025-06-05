import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleDto } from './dto/role.dto';
import { AuthRoles } from 'src/auth/decorators/auth-roles.decorator';
import { ApiBearerAuth, ApiConflictResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleCreateResponse } from './dto/role-create.dto';
import { RoleListResponse } from './dto/role-list.dto';

@ApiTags('Role')
@ApiBearerAuth('jwt-token')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  @ApiOperation({
    summary: "Создание роли пользователя",
    description: "Создание новой роли для доступы к роутам"
  })
  @ApiOkResponse({
    type: RoleCreateResponse
  })
  @ApiConflictResponse({
    description: "Данная роль уже существует"
  })
  @AuthRoles('ADMIN')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: RoleDto) {
    return await this.roleService.create(dto)
  }

  @ApiOperation({
    summary: "Список ролей",
    description: "Получение списка ролей для пользователей"
  })
  @ApiOkResponse({
    type: RoleListResponse
  })
  @AuthRoles('*')
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll() {
    return await this.roleService.getAll()
  }

  @ApiOperation({
    summary: "Редактирование роли",
    description: "Изменение имени роли пользователя"
  })
  @ApiOkResponse({
    description: "true"
  })
  @ApiNotFoundResponse({
    description: "Данная роль не обнаружена"
  })
  @AuthRoles('ADMIN')
  @Patch(':id')
  @HttpCode(HttpStatus.CREATED)
  async update(@Param("id") id: string, @Body() dto: RoleDto) {
    return await this.roleService.update(id, dto)
  }

  @ApiOperation({
    summary: "Удаление роли",
    description: "Удаление роли пользователя"
  })
  @ApiOkResponse({
    description: "true"
  })
  @ApiNotFoundResponse({
    description: "Данная роль не обнаружена"
  })
  @AuthRoles('ADMIN')
  @Delete(':id')
  @HttpCode(HttpStatus.CREATED)
  async deleteRole(@Param("id") id: string) {
    return await this.roleService.deleteRole(id)
  }
}
