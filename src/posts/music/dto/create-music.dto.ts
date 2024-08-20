import { PickType } from '@nestjs/mapped-types';
import { MusicModel } from 'src/common/entity/music.entity';

export class CreatePostMusicDto extends PickType(MusicModel, [
  'path',
  'post',
  'type',
]) {}
