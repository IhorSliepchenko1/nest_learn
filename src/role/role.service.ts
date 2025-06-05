import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleDto } from './dto/role.dto';
import { Role } from '@prisma/client';

@Injectable()
export class RoleService {
     constructor(private readonly prismaService: PrismaService) { }

     async create(dto: RoleDto) {
          const isRole = await this.prismaService.role.findUnique({
               where: { name: dto.name }
          })

          if (isRole) {
               throw new ConflictException("Данная роль уже существует")
          }

          const role = await this.prismaService.role.create({
               data: {
                    name: dto.name
               },

               select: {
                    name: true
               }
          })

          return { name: role.name }
     }

     async getAll(): Promise<{ roles: string[] }> {
          const roles = await this.prismaService.role.findMany({
               select: {
                    name: true
               }
          })
          return { roles: roles.map((role) => role.name) }
     }

     private async getById(id: string): Promise<Role> {
          const role = await this.prismaService.role.findUnique({
               where: { id }
          })

          if (!role) {
               throw new NotFoundException("Данная роль не обнаружена")
          }

          return role
     }

     async update(id: string, dto: RoleDto) {
          const { name } = dto
          await this.getById(id)

          await this.prismaService.role.update({
               data: {
                    name
               },
               where: { id }
          })

          return true
     }

     async deleteRole(id: string) {
          await this.getById(id)
          await this.prismaService.role.delete({
               where: { id },
          })

          return true
     }
}
