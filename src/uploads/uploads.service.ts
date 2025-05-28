import { Injectable } from '@nestjs/common';
import { writeFileSync } from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadsService {
     saveFileInfo(file: Express.Multer.File) {
          const { filename } = file
          path.join(__dirname, '../../uploads', filename);
          return filename
     }


     saveBufferAsFile(buffer: Buffer, filenamePrefix: string = 'avatar'): string {
          const fileName = `${filenamePrefix}_${uuidv4()}.png`;
          const filePath = path.join(__dirname, '../../uploads', fileName);

          writeFileSync(filePath, buffer);

          return fileName
     }
}

