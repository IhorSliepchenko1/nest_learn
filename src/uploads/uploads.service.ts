import { Injectable } from '@nestjs/common';
import * as path from 'path';

@Injectable()
export class UploadsService {
     saveFileInfo(file: Express.Multer.File): string {
          const filePath = path.join(__dirname, '../../uploads', file.filename);
          return `Файл збережено за адресою: ${filePath}`;
     }
}
