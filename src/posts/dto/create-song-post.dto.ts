import { PickType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { SongPostModel } from '../entity/songPost.entity';

// Pick, Omit, Partial -> Type 반환
// PickType, OmitType, PartialType -> 값을 반환

export class CreateSongPostDto extends PickType(SongPostModel, [
  'title',
  'author',
]) {
  @IsString()
  @IsOptional()
  image: string;

  @IsString()
  @IsOptional()
  song: string;
}
