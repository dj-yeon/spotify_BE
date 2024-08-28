import { PickType } from '@nestjs/mapped-types';
import { SongModel } from 'src/common/entity/song.entity';

export class CreatePostSongDto extends PickType(SongModel, [
  'fileName',
  'songPost',
  'type',
]) {}
