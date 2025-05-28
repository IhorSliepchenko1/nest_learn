import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  mixin,
  Type,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export function UploadFileInterceptor(allowedTypes: string[], MB: number, fieldName: string = 'file'): Type<NestInterceptor> {
  @Injectable()
  class MixinInterceptor implements NestInterceptor {
    private readonly interceptor: NestInterceptor;

    constructor() {
      const InterceptorClass = FileInterceptor(fieldName, {

        storage: diskStorage({
          destination: (_req, _file, cb) => {
            cb(null, './uploads');
          },

          filename: (_req, file, cb) => {
            const UUID = uuidv4()
            const ext = path.extname(file.originalname);
            cb(null, `${file.fieldname}_${UUID}${ext}`);
          },
        }),

        fileFilter: (_req, file, cb) => {
          if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
          }
          else {
            cb(new BadRequestException('Данный тип файла не поддерживается'), false);
          }
        },
        limits: { fileSize: MB * 1024 * 1024 },
      });

      this.interceptor = new InterceptorClass() as NestInterceptor;
    }

    intercept(context: ExecutionContext, next: CallHandler) {
      return this.interceptor.intercept(context, next);
    }
  }

  return mixin(MixinInterceptor);
}
