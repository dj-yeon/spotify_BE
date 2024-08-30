import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { join } from 'path';
import { createReadStream } from 'fs';

import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { POST_IMAGE_PATH, POST_SONG_PATH } from './const/path.const';
import { CommonService } from './common.service';
import { SongPostModel } from 'src/posts/entity/songPost.entity';

@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(AccessTokenGuard)
  postImage(@UploadedFile() file: Express.Multer.File) {
    return {
      fileName: file.filename,
    };
  }

  @Post('song')
  @UseInterceptors(FileInterceptor('song'))
  @UseGuards(AccessTokenGuard)
  postSong(@UploadedFile() file: Express.Multer.File) {
    return {
      fileName: file.filename,
    };
  }

  @Get('image/:fileName')
  async getImage(@Param('fileName') fileName: string, @Res() res: Response) {
    const imagePath = join(POST_IMAGE_PATH, fileName);

    const imageStream = createReadStream(imagePath);
    imageStream.on('error', (error) => {
      console.error('Error reading image:', error);
      res.status(404).send('Image not found');
    });

    imageStream.pipe(res);
  }

  @Get('song/:filename')
  getSong(@Param('filename') fileName: string, @Res() res: Response) {
    const songPathPath = join(POST_SONG_PATH, fileName);

    res.sendFile(songPathPath);
  }

  @Get('getsongbyid/:id')
  async getSongById(@Param('id') id: string): Promise<SongPostModel> {
    const song = await this.commonService.findOneById(id);
    if (!song) {
      throw new NotFoundException('Song not found');
    }
    return song;
  }
}
