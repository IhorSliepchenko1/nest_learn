import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator"

export class ChangeOwnPasswordDto {
     @ApiProperty({
          example: '123456',
          description: 'Новый пароль'
     })
     @IsString({ message: "Пароль должен быть строкой" })
     @IsNotEmpty({ message: "Пароль обязателен к заполнению" })
     @MinLength(6, { message: "Пароль должен содержать не менее 6 символов" })
     @MaxLength(15, { message: "Пароль не должен превышать 15 символов" })
     newPassword: string

     @ApiProperty({
          example: '123456',
          description: 'Старый пароль'
     })
     @IsString({ message: "Пароль должен быть строкой" })
     @IsNotEmpty({ message: "Пароль обязателен к заполнению" })
     @MinLength(6, { message: "Пароль должен содержать не менее 6 символов" })
     @MaxLength(15, { message: "Пароль не должен превышать 15 символов" })
     oldPassword: string
}