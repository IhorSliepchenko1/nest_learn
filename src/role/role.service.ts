import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleDto } from './dto/role.dto';

@Injectable()
export class RoleService {
     constructor(private readonly prismaService: PrismaService) { }

     async addRole(dto: RoleDto) {
          return await this.prismaService.role.create({
               data: {
                    name: dto.name
               }
          })
     }
}
