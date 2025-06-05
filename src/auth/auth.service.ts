import { Request, Response } from 'express';
import * as argon2 from "argon2";
import parse from 'parse-duration'
import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtPayload } from './interfaces/jwt.interface';
import { isDev } from 'src/utils/is-dev.utils';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as jdenticon from "jdenticon"
import { UploadsService } from 'src/uploads/uploads.service';

@Injectable()
export class AuthService {
     private readonly JWT_ACCESS_TOKEN_TTL: string
     private readonly JWT_REFRESH_TOKEN_TTL: string
     private readonly JWT_REFRESH_TOKEN_TTL_MS: number
     private readonly COOKIE_DOMAIN: string

     constructor(
          private readonly configService: ConfigService,
          private readonly jwtService: JwtService,
          private readonly prismaService: PrismaService,
          private readonly uploadsService: UploadsService,
     ) {
          this.JWT_ACCESS_TOKEN_TTL = configService.getOrThrow("JWT_ACCESS_TOKEN_TTL")
          this.JWT_REFRESH_TOKEN_TTL = configService.getOrThrow("JWT_REFRESH_TOKEN_TTL")
          this.JWT_REFRESH_TOKEN_TTL_MS = parse(this.JWT_REFRESH_TOKEN_TTL) as number
          this.COOKIE_DOMAIN = configService.getOrThrow("COOKIE_DOMAIN")
     }

     async register(res: Response, dto: RegisterDto) {
          const { email, rolesId, password, name } = dto

          const isUser = await this.prismaService.user.findUnique({
               where: { email }
          })

          if (isUser) {
               throw new ConflictException("Пользователь уже зарегистирован")
          }

          const roles = await this.prismaService.role.findMany({
               where: {
                    id: { in: rolesId }
               }
          })

          if (!roles || !roles.length) throw new NotFoundException('Роли не найдены')

          const hashPassword = await argon2.hash(password)
          const { avatarUrl } = this.generateAvatar(name)

          const user = await this.prismaService.user.create({
               data: {
                    email,
                    password: hashPassword,
                    name,
                    avatarUrl,
                    roles: {
                         connect: roles.map((role) => ({
                              id: role.id
                         }))
                    },
               },

               select: {
                    id: true,
                    roles: true
               }
          })

          const userRoleNames = user.roles.map(r => r.name)
          return this.auth(res, user.id, userRoleNames)
     }

     private generateAvatar(name: string) {
          const fileBuffer = jdenticon.toPng(name, 200);
          const avatarUrl = this.uploadsService.saveBufferAsFile(fileBuffer);
          return { avatarUrl };
     }

     async login(res: Response, dto: LoginDto) {
          const { email, password } = dto

          const user = await this.prismaService.user.findUnique({
               where: {
                    email
               },

               select: {
                    id: true,
                    password: true,

                    roles: {
                         select: {
                              name: true
                         }
                    }
               }
          })

          if (!user) {
               throw new UnauthorizedException("Не верный логин или пароль")
          }

          const verifyPassword = await argon2.verify(user.password, password)

          if (!verifyPassword) {
               throw new UnauthorizedException("Не верный логин или пароль")
          }

          const roles = user.roles.map(r => r.name)

          if (!roles || !roles.length) throw new NotFoundException('Роли не найдены')
          return this.auth(res, user.id, roles)

     }

     async refresh(req: Request, res: Response) {
          const refreshToken = req.cookies['refreshToken']

          if (!refreshToken) {
               throw new UnauthorizedException("Не действительный refresh-токен")
          }

          const payload: JwtPayload = await this.jwtService.verifyAsync(refreshToken)

          if (payload) {
               const user = await this.prismaService.user.findUnique({
                    where: {
                         id: payload.id
                    },

                    select: {
                         id: true,
                         roles: {
                              select: {
                                   name: true
                              }
                         }
                    }
               })

               if (!user) {
                    throw new NotFoundException('Пользователь не найден')
               }

               const roles = user.roles.map(r => r.name)
               if (!roles || !roles.length) throw new ConflictException('Роли не найдены')

               return this.auth(res, user.id, roles)
          }
     }

     async logout(res: Response) {
          this.setRefreshTokenCookie(res, 'refreshToken', new Date(0))
          return true
     }

     async validate(id: string) {
          const user = await this.prismaService.user.findUnique({
               where: { id },
               select: {
                    id: true,
                    roles: {
                         select: {
                              name: true
                         }
                    }
               }
          })

          if (!user) throw new NotFoundException("Пользователь не найден")

          return {
               id: user.id,
               roles: user.roles.map(r => r.name)
          }
     }

     private auth(res: Response, id: string, roles: string[]) {
          const { accessToken, refreshToken } = this.generateTokens(id, roles)

          this.setRefreshTokenCookie(res, refreshToken, new Date(Date.now() + this.JWT_REFRESH_TOKEN_TTL_MS))

          return accessToken
     }

     private generateTokens(id: string, roles: string[]) {
          const payload: JwtPayload = { id, roles }

          const accessToken = this.jwtService.sign(payload, {
               expiresIn: this.JWT_ACCESS_TOKEN_TTL
          })

          const refreshToken = this.jwtService.sign(payload, {
               expiresIn: this.JWT_REFRESH_TOKEN_TTL
          })

          return {
               accessToken,
               refreshToken
          }
     }

     private setRefreshTokenCookie(res: Response, value: string, expires: Date) {
          return res.cookie("refreshToken", value, {
               expires,
               httpOnly: true,
               domain: this.COOKIE_DOMAIN,
               secure: !isDev(this.configService),
               sameSite: "none",
          })
     }
}