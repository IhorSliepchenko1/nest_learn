import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsNotEmpty, IsString, IsUUID } from "class-validator"

export class UpdateUserRolesDto {
     @ApiProperty({
          example: "8d6a47d2-d734-432f-b014-7fb51cd7a66b",
          description: 'id пользователя'
     })
     @IsString()
     @IsNotEmpty()
     userId: string

     @ApiProperty({
          example: [`8d6a47d2-d734...`, `8d6a47d2-d734-432f...`],
          description: 'Список id для ролей'
     })
     @IsArray()
     @IsUUID('4', { each: true })
     rolesId: string[]
}