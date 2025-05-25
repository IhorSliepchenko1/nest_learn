import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleDto } from './dto/role.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/decorators/auth.decorator';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  @JwtAuthGuard()
  @Roles('ADMIN')
  @Post('add')
  @HttpCode(HttpStatus.CREATED)
  async addRole(@Body() dto: RoleDto) {
    return await this.roleService.addRole(dto)
  }


  @Get("all")
  @HttpCode(HttpStatus.OK)
  async getAll() {
    return await this.roleService.getRole()
  }
}
