import { BadRequestException, ConflictException, Injectable, NotFoundException, Param } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChangeOwnPasswordDto } from './dto/change-own-password.dto';
import { JwtPayload } from 'src/auth/interfaces/jwt.interface';
import { Request } from 'express';
import * as argon2 from "argon2";
import { ChangePasswordAsAdminDto } from './dto/change-password-as-admin.dto';
import { UploadsService } from 'src/uploads/uploads.service';
import { UpdateUserRolesDto } from './dto/update-user-roles.dto';
import { RoleService } from 'src/role/role.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
     constructor(
          private readonly prismaService: PrismaService,
          private readonly uploadsService: UploadsService,
     ) { }

     async changePasswordAsAdmin(dto: ChangePasswordAsAdminDto) {
          const { userId, newPassword, oldPassword } = dto
          await this.changePassword(userId, newPassword, oldPassword)
          return true
     }

     async changeOwnPassword(req: Request, dto: ChangeOwnPasswordDto) {
          const { id } = req.user as JwtPayload
          const { newPassword, oldPassword } = dto
          await this.changePassword(id, newPassword, oldPassword)
          return true
     }

     private async getUserById(id: string): Promise<User> {
          const user = await this.prismaService.user.findUnique({
               where: { id }
          })

          if (!user) throw new NotFoundException("Пользователь не найден")

          return user
     }

     async changeAvatar(req: Request, file: Express.Multer.File) {
          const { id } = req.user as JwtPayload
          const avatarUrl = this.uploadsService.saveFileInfo(file)

          await this.prismaService.user.update({
               data: {
                    avatarUrl
               },
               where: { id }
          })

          return true
     }

     async updateUserRoles(dto: UpdateUserRolesDto): Promise<{ message: string }> {
          const { userId, rolesId } = dto

          const user = await this.prismaService.user.findUnique({
               where: { id: userId },
               select: {
                    roles: {
                         select: {
                              id: true
                         }
                    }
               }
          })

          if (!user) {
               throw new NotFoundException("Пользователь не найден")
          }

          const existingRoles = await this.prismaService.role.findMany({
               where: { id: { in: rolesId } },
               select: { id: true }
          });

          const existingRoleIds = existingRoles.map(r => r.id);

          const invalidRoles = rolesId.filter(id => !existingRoleIds.includes(id));
          if (invalidRoles.length > 0) {
               throw new ConflictException(`Некоторые роли не существуют: ${invalidRoles.join(', ')}`);
          }

          const currentRoles = user.roles.map(r => r.id);
          const newRolesToAdd = existingRoleIds.filter(id => !currentRoles.includes(id));

          if (newRolesToAdd.length === 0) {
               throw new BadRequestException('Новые роли не добавлены, так как они уже присутствуют')
          }

          await this.prismaService.user.update({
               data: {
                    roles: {
                         connect: newRolesToAdd.map(id => ({ id }))
                    }
               },
               where: { id: userId }
          });

          return { message: 'Новые роли успешно добавлены' };
     }

     private async changePassword(id: string, newPassword: string, oldPassword: string) {
          const user = await this.prismaService.user.findUnique({
               where: {
                    id
               },
               select: {
                    id: true,
                    password: true
               }
          })

          if (!user) {
               throw new NotFoundException("Пользователь не найден")
          }

          const isSamePassword = await argon2.verify(user.password, newPassword);
          const isMatchPassword = await argon2.verify(user.password, oldPassword)

          if (isSamePassword || !isMatchPassword) {
               throw new BadRequestException('Ошибка ввода пароля');
          }

          const hashNewPassword = await argon2.hash(newPassword)

          await this.prismaService.user.update({
               data: {
                    password: hashNewPassword
               },
               where: { id: user.id }
          })
     }
}
