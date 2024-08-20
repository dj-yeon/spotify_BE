import { BadRequestException, Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import * as multer from 'multer';
import {
  TEMP_IMAGE_FOLDER_PATH,
  TEMP_MUSIC_FOLDER_PATH,
} from 'src/common/const/path.const';
import { v4 as uuid } from 'uuid';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    MulterModule.register({
      limits: {
        // byte 단위
        fileSize: 10000000,
      },
      fileFilter: (req, file, cb) => {
        /**
         * cb(에러, boolean)
         *
         * 1.파라미터: 에러가 있을 경우, 에러정보 넣어줌.
         * 2.파라미터: 파일을 받을지 말지 boolean을 넣어준다.
         */

        const ext = extname(file.originalname);
        const fileType = req.body.fileType; // 요청에서 파일 유형을 확인 (예: 'image' 또는 'music')

        if (fileType === 'image') {
          if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
            return cb(
              new BadRequestException('jpg/jpeg/png 파일만 업로드 가능합니다!'),
              false,
            );
          }
        } else if (fileType === 'music') {
          if (ext !== '.mp3' && ext !== '.wav') {
            return cb(
              new BadRequestException('mp3/wav 파일만 업로드 가능합니다!'),
              false,
            );
          }
        } else {
          return cb(
            new BadRequestException('파일 유형이 올바르지 않습니다!'),
            false,
          );
        }

        return cb(null, true);
      },
      storage: multer.diskStorage({
        destination: function (req, file, cb) {
          const fileType = req.body.fileType; // 요청에서 파일 유형을 확인

          if (fileType === 'image') {
            cb(null, TEMP_IMAGE_FOLDER_PATH); // 이미지 파일의 임시 저장소
          } else if (fileType === 'music') {
            cb(null, TEMP_MUSIC_FOLDER_PATH); // 음악 파일의 임시 저장소
          }
        },
        filename: function (req, file, cb) {
          cb(null, `${uuid()}${extname(file.originalname)}`);
        },
      }),
    }),
  ],
  controllers: [CommonController],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
