import { IsArray, IsNotEmpty, IsString, IsUUID } from "class-validator"

export class UpdateUserRolesDto {
     @IsString()
     @IsNotEmpty()
     userId: string

     @IsArray()
     @IsUUID('4', { each: true })
     rolesId: string[]
}