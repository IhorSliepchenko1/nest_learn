import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RoleDto {
     @ApiProperty({
          example: 'ADMIN',
          description: 'Роль пользователя'
     })
     @IsNotEmpty()
     @IsString()
     name: string
}