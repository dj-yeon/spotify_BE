import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseModel } from './base.entity';
import { IsEnum, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { POST_PUBLIC_MUSIC_PATH } from '../const/path.const';
import { join } from 'path';
import { PostsModel } from 'src/posts/entity/posts.entity';

export enum MusicModelType {
  POST_MUSIC,
}

@Entity()
export class MusicModel extends BaseModel {
  // UserModel -> 사용자 프로필 이미지
  // PostsModel -> 포스트 이미지
  @Column({
    enum: MusicModelType,
  })
  @IsEnum(MusicModelType)
  @IsString()
  type: MusicModelType;

  @Column()
  @IsString()
  @Transform(({ value, obj }) => {
    if (obj.type === MusicModelType.POST_MUSIC) {
      return `/${join(POST_PUBLIC_MUSIC_PATH, value)}`;
    } else {
      return value;
    }
  })
  path: string;

  @ManyToOne(() => PostsModel, (post) => post.music)
  post?: PostsModel;
}
