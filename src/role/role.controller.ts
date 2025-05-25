import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleDto } from './dto/role.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  @Post('add')
  @HttpCode(HttpStatus.CREATED)
  async addRole(@Body() dto: RoleDto) {
    return await this.roleService.addRole(dto)
  }
}
