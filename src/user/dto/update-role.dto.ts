import { ApiProperty } from "@nestjs/swagger";

export class UpdateRoleResponse {
     @ApiProperty({
          description: "Добавление новых ролей пользователя",
          example: "Новые роли успешно добавлены"
     })

     message: string
}