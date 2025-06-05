import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEmail, IsNotEmpty, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class RegisterDto {
     @ApiProperty({ example: 'Петров Иван', description: 'Имя пользователя' })
     @IsString({ message: "Имя должно быть строкой" })
     @IsNotEmpty({ message: "Имя обязательна к заполнению" })
     name: string

     @ApiProperty({ example: 'user@example.com', description: 'Email пользователя' })
     @IsString({ message: "Почта должно быть строкой" })
     @IsNotEmpty({ message: "Email обязателен" })
     @IsEmail({}, { message: "Некорректный формат email" })
     email: string

     @ApiProperty({ example: '123456', description: 'Пароль' })
     @IsString({ message: "Пароль должен быть строкой" })
     @IsNotEmpty({ message: "Пароль обязателен к заполнению" })
     @MinLength(6, { message: "Пароль должен содержать не менее 6 символов" })
     @MaxLength(15, { message: "Пароль не должен превышать 15 символов" })
     password: string

     @ApiProperty({ example: '["2f9150fa-80fd-4761-b80a-9c3a28498762"]', description: 'Роли пользователя' })
     @IsArray()
     @IsUUID('4', { each: true })
     rolesId: string[]
}