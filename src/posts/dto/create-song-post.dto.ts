import { PickType } from '@nestjs/mapped-types';
// import { IsString } from 'class-validator';
import { SongPostModel } from '../entity/songPost.entity';

// Pick, Omit, Partial -> Type 반환
// PickType, OmitType, PartialType -> 값을 반환

export class CreateSongPostDto extends PickType(SongPostModel, [
  'title',
  'author',
  'imageFileName',
  'songFileName',
]) {
  // @IsString()
  // //@IsOptional()
  // imageFileName: string;
  // @IsString()
  // //@IsOptional()
  // songFileName: string;
}
