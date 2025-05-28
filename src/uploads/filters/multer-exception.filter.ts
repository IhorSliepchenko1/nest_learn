import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

export function createMulterFilter(size: string): ExceptionFilter {
     return {
          catch(exception: any, host: ArgumentsHost) {
               const ctx = host.switchToHttp();
               const response = ctx.getResponse() as Response;

               let message: string = ''

               switch (exception.message) {
                    case 'File too large':
                         message = `Файл слишком большой. Максимальный размер — ${size}.`;
                         break;
                    default:
                         message = exception.message;
               }

               response.status(400).json({
                    statusCode: 400,
                    message,
                    error: 'Bad Request',
               });
          },
     };
}
