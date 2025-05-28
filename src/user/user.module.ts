import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UploadsModule } from 'src/uploads/uploads.module';

@Module({
  imports: [UploadsModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
