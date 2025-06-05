import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { NameValidatePipe } from './pipes/name-validate.pipe';
import { AuthRoles, Public } from './decorators/auth-roles.decorator';
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthResponse } from './dto/auth.dto';

@ApiTags('Auth')
@ApiBearerAuth('jwt-token')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiOperation({
    summary: "Создание аккаунта",
    description: "Создание нового аккаунта"
  })
  @ApiOkResponse({
    type: AuthResponse
  })
  @ApiConflictResponse({
    description: "Пользователь с такой почтой уже существует"
  })
  @ApiBadRequestResponse({
    description: 'Некорректные входные данные'
  })
  @Public()
  @UsePipes(NameValidatePipe)
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Res({ passthrough: true }) res: Response, @Body() dto: RegisterDto) {
    return await this.authService.register(res, dto)
  }

  @ApiOperation({
    summary: "Вход в систему"
  })
  @ApiOkResponse({
    description: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....'
  })
  @ApiUnauthorizedResponse({
    description: 'Не верный логин или пароль'
  })
  @ApiNotFoundResponse({
    description: 'Роли не найдены'
  })
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Res({ passthrough: true }) res: Response, @Body() dto: LoginDto) {
    return await this.authService.login(res, dto)
  }

  @ApiOperation({
    summary: "Обновления refresh-token"
  })
  @ApiOkResponse({
    description: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....'
  })
  @ApiUnauthorizedResponse({
    description: 'Не действительный refresh-токен'
  })
  @ApiNotFoundResponse({
    description: "Пользователь не найден",
  })
  @ApiConflictResponse({
    description: 'Роли не найдены'
  })
  @AuthRoles('*')
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
    return await this.authService.refresh(req, res)
  }

  @ApiOperation({
    summary: "Сброс refresh-token"
  })
  @ApiOkResponse({
    description: 'true'
  })
  @AuthRoles('*')
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    return await this.authService.logout(res)
  }
}


