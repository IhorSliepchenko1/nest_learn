import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChangeUserPasswordByAdminDto } from './dto/change-user-password-by-admin.dto';
import { ChangeOwnPasswordDto } from './dto/change-own-password.dto';
import { JwtPayload } from 'src/auth/interfaces/jwt.interface';
import { Request } from 'express';
import * as argon2 from "argon2";

@Injectable()
export class UserService {
     constructor(private readonly prismaService: PrismaService) { }

     async adminChangeUserPassword(dto: ChangeUserPasswordByAdminDto) {
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
               throw new BadRequestException("Пользователь не найден")
          }

          const isSamePassword = await argon2.verify(user.password, newPassword);
          if (isSamePassword) {
               throw new BadRequestException('Новый пароль должен отличаться от старого');
          }

          const isMatchPassword = await argon2.verify(user.password, oldPassword)

          if (!isMatchPassword) {
               throw new BadRequestException('Старый пароль неверный')
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
