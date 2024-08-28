import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { basename, join } from 'path';
import {
  POST_SONG_PATH,
  TEMP_SONG_FOLDER_PATH,
} from 'src/common/const/path.const';
import { promises } from 'fs';
import { SongModel } from 'src/common/entity/song.entity';
import { CreatePostSongDto } from './dto/create-song.dto';

@Injectable()
export class PostsSongsService {
  constructor(
    @InjectRepository(SongModel)
    private readonly songRepository: Repository<SongModel>,
  ) {}

  getRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<SongModel>(SongModel)
      : this.songRepository;
  }

  async createPostSong(dto: CreatePostSongDto, qr?: QueryRunner) {
    const repository = this.getRepository(qr);

    // dto의 이미지 이름 기반, 파일 경로 생성
    const tempFilePath = join(TEMP_SONG_FOLDER_PATH, dto.fileName);

    try {
      // 파일 존재 확인
      await promises.access(tempFilePath);
    } catch (e) {
      throw new BadRequestException('존재하지 않는 파일.');
    }

    // 파일 이름만 가져오기
    const fileName = basename(tempFilePath);

    // 새로 이동할 포스트 폴더의 이동 경로 + 이미지 이름
    const newPath = join(POST_SONG_PATH, fileName);

    // save
    const result = await repository.save({
      ...dto,
    });

    console.log('********* song result', result);

    // 파일 옮기기
    await promises.rename(tempFilePath, newPath);

    return result;
  }
}
