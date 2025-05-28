import { Controller, Get, Param, Post, Res, UploadedFile, UseFilters, UseInterceptors } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { Response } from 'express';
import * as path from 'path';
import { UploadFileInterceptor } from './interceptors/upload-file.interceptor';
import { createMulterFilter } from './filters/multer-exception.filter';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) { }

  @Post()
  @UseInterceptors(UploadFileInterceptor(
    ['image/jpeg', 'image/png', 'application/pdf'], 5
  ))
  @UseFilters(createMulterFilter('5мб'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadsService.saveFileInfo(file);
  }

  @Get(':filename')
  getFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = path.join(__dirname, '../../uploads', filename);
    return res.sendFile(filePath);
  }

}
