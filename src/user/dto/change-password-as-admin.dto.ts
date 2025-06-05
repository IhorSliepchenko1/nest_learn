import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, IsUUID, MaxLength, MinLength } from "class-validator"

export class ChangePasswordAsAdminDto {
     @ApiProperty({
          example: "8d6a47d2-d734-432f-b014-7fb51cd7a66b",
          description: 'id пользователя которому будем менять пароль'
     })
     @IsNotEmpty({ message: "userId обязательно к заполнению" })
     @IsUUID('4')
     userId: string

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