import { Roles } from "@prisma/client";
import { IsEmail, IsNotEmpty, IsString, IsUUID, Length, Max, MaxLength, Min, MinLength } from "class-validator";

export class RegisterDto {
     @IsString({ message: "Почта должно быть строкой" })
     @IsNotEmpty({ message: "Имя обязательна к заполнению" })
     @IsEmail({}, { message: "Некорректный формат email" })
     email: string

     @IsString({ message: "Пароль должен быть строкой" })
     @IsNotEmpty({ message: "Пароль обязателен к заполнению" })
     @MinLength(6, { message: "Пароль должен содержать не менее 6 символов" })
     @MaxLength(15, { message: "Пароль не должен превышать 15 символов" })
     password: string

     @IsString({ message: "Роль должна быть строкой" })
     role: Roles
}