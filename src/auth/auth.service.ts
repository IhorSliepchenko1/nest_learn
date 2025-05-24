import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import parse from 'parse-duration'
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { JwtPayload } from './interfaces/jwt.interface';
import { isDev } from 'src/utils/is-dev.utils';
import { RegisterDto } from './dto/register.dto';
import * as argon2 from "argon2";
import { LoginDto } from './dto/login.dto';
import { Roles } from '@prisma/client';

@Injectable()
export class AuthService {
     private readonly JWT_ACCESS_TOKEN_TTL: string
     private readonly JWT_REFRESH_TOKEN_TTL: string
     private readonly JWT_REFRESH_TOKEN_TTL_MS: number
     private readonly COOKIE_DOMAIN: string

     constructor(
          private readonly configService: ConfigService,
          private readonly jwtService: JwtService,
          private readonly prismaService: PrismaService
     ) {
          this.JWT_ACCESS_TOKEN_TTL = configService.getOrThrow("JWT_ACCESS_TOKEN_TTL")
          this.JWT_REFRESH_TOKEN_TTL = configService.getOrThrow("JWT_REFRESH_TOKEN_TTL")
          this.JWT_REFRESH_TOKEN_TTL_MS = parse(this.JWT_REFRESH_TOKEN_TTL) as number
          this.COOKIE_DOMAIN = configService.getOrThrow("COOKIE_DOMAIN")
     }

     async register(res: Response, dto: RegisterDto) {
          const { email, role, password } = dto

          const isUser = await this.prismaService.user.findUnique({
               where: { email }
          })

          if (isUser) {
               throw new ConflictException("Пользователь уже зарегистирован")
          }

          const hashPassword = await argon2.hash(password)

          const user = await this.prismaService.user.create({
               data: {
                    email,
                    role,
                    password: hashPassword
               },

               select: {
                    id: true,
                    role: true
               }
          })

          return this.auth(res, user.id, user.role)
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
                    role: true
               }
          })

          if (!user) {
               throw new UnauthorizedException("Не верный логин или пароль")
          }

          const verifyPassword = await argon2.verify(user.password, password)

          if (!verifyPassword) {
               throw new UnauthorizedException("Не верный логин или пароль")
          }

          return this.auth(res, user.id, user.role)
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
                         role: true
                    }
               })

               if (!user) {
                    throw new NotFoundException('Пользователь не найден')
               }

               return this.auth(res, user.id, user.role)
          }

     }

     async logout(res: Response) {
          this.setRefreshTokenCookie(res, 'refreshToken', new Date(0))
          return true
     }

     async validate(id: string) {
          const user = await this.prismaService.user.findUnique({
               where: { id },
          })

          if (!user) throw new NotFoundException("Пользователь не найден")

          return user
     }

     private auth(res: Response, id: string, role: Roles) {
          const { accessToken, refreshToken } = this.generateTokens(id, role)

          this.setRefreshTokenCookie(res, refreshToken, new Date(Date.now() + this.JWT_REFRESH_TOKEN_TTL_MS))

          return accessToken
     }

     private generateTokens(id: string, role: Roles) {
          const payload: JwtPayload = { id, role }

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
