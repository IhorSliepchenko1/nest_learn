import { Injectable, NotFoundException } from '@nestjs/common';
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

     async getRole() {
          return await this.prismaService.role.findMany({
               select: {
                    name: true
               }
          })
     }

     async rename(id: string, dto: RoleDto) {
          const { name } = dto

          const role = await this.prismaService.role.findUnique({
               where: { id }
          })

          if (!role) {
               throw new NotFoundException("Данная роль не обнаружена")
          }

          await this.prismaService.role.update({
               data: {
                    name
               },
               where: { id }
          })

          return true
     }
}
