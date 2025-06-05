import { ApiProperty } from "@nestjs/swagger";



export class RoleListResponse {
     @ApiProperty({
          description: "Получение ролей",
          example: ["ADMIN", "MANAGER", "USER"],
          type: [String],
     })

     roles: string[]
}