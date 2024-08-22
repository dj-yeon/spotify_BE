import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseModel } from './base.entity';
import { IsEnum, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { POST_PUBLIC_SONG_PATH } from '../const/path.const';
import { join } from 'path';
import { SongPostModel } from 'src/posts/entity/songPost.entity';

export enum SongModelType {
  POST_SONG,
}

@Entity()
export class SongModel extends BaseModel {
  // UserModel -> 사용자 프로필 이미지
  // PostsModel -> 포스트 이미지
  @Column({
    enum: SongModelType,
  })
  @IsEnum(SongModelType)
  @IsString()
  type: SongModelType;

  @Column()
  @IsString()
  @Transform(({ value, obj }) => {
    if (obj.type === SongModelType.POST_SONG) {
      return `/${join(POST_PUBLIC_SONG_PATH, value)}`;
    } else {
      return value;
    }
  })
  path: string;

  @ManyToOne(() => SongPostModel, (post) => post.song)
  songPost?: SongPostModel;
}
