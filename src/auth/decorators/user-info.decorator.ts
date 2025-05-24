import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "@prisma/client";
import { Request } from "express";

export const UserInfo = createParamDecorator((data: keyof User, ctx: ExecutionContext) => {
     const req = ctx.switchToHttp().getRequest() as Request
     const user = req.user

     return data ? user?.[data] : user
})