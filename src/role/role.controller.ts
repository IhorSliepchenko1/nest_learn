import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleDto } from './dto/role.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/decorators/auth.decorator';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  @JwtAuthGuard()
  @Roles('ADMIN')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addRole(@Body() dto: RoleDto) {
    return await this.roleService.addRole(dto)
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll() {
    return await this.roleService.getRole()
  }

  @JwtAuthGuard()
  @Roles('ADMIN')
  @Patch(':id')
  @HttpCode(HttpStatus.CREATED)
  async rename(@Param("id") id: string, @Body() dto: RoleDto) {
    return await this.roleService.rename(id, dto)
  }
}
