import { ChangeOwnPasswordDto } from './dto/change-own-password.dto';
import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, Req, Res, UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './decorators/auth.decorator';
import { UserInfo } from './decorators/user-info.decorator';
import { User } from '@prisma/client';
import { Roles } from './decorators/roles.decorator';
import { NameValidatePipe } from './pipes/name-validate.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UsePipes(NameValidatePipe)
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Res({ passthrough: true }) res: Response, @Body() dto: RegisterDto) {
    return await this.authService.register(res, dto)
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Res({ passthrough: true }) res: Response, @Body() dto: LoginDto) {
    return await this.authService.login(res, dto)
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
    return await this.authService.refresh(req, res)
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    return await this.authService.logout(res)
  }

  @JwtAuthGuard()
  @Roles('ADMIN')
  @Get('@me')
  getProfile(@UserInfo() user: User) {
    return user
  }
}
