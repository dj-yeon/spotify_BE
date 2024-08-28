import { Column, Entity, ManyToOne, Unique } from 'typeorm';
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
@Unique(['fileName']) // path 필드에 고유 제약 조건 추가
export class SongModel extends BaseModel {
  // UserModel -> 사용자 프로필 이미지
  // PostsModel -> 포스트 이미지
  @Column({
    type: 'varchar', // 열거형을 문자열로 저장하도록 설정
    enum: SongModelType,
    default: SongModelType.POST_SONG, // 기본값 설정
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
  fileName: string;

  @ManyToOne(() => SongPostModel)
  songPost?: SongPostModel;
}
