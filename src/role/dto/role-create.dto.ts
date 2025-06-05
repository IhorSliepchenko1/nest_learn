import { ApiProperty } from "@nestjs/swagger";

export class RoleCreateResponse {
     @ApiProperty({
          description: "Создрание роли",
          example: "ADMIN"
     })

     name: string
}