import { ApiProperty } from "@nestjs/swagger";

export class AuthResponse {
     @ApiProperty({
          description: "JWT acces token",
          example: "kljkhfjgklgjdlkfgjkl2323kj...."
     })

     accessToken: string
}