import { Column, Entity, OneToOne, Unique } from 'typeorm';
import { BaseModel } from './base.entity';
import { IsEnum, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { POST_PUBLIC_IMAGE_PATH } from '../const/path.const';
import { join } from 'path';
import { SongPostModel } from 'src/posts/entity/songPost.entity';

export enum ImageModelType {
  POST_IMAGE,
}

@Entity()
@Unique(['fileName']) // path 필드에 고유 제약 조건 추가
export class ImageModel extends BaseModel {
  // UserModel -> 사용자 프로필 이미지
  // PostsModel -> 포스트 이미지
  @Column({
    type: 'varchar', // 열거형을 문자열로 저장하도록 설정
    enum: ImageModelType,
    default: ImageModelType.POST_IMAGE, // 기본값 설정
  })
  @IsEnum(ImageModelType)
  @IsString()
  type: ImageModelType;

  @Column()
  @IsString()
  @Transform(({ value, obj }) => {
    if (obj.type === ImageModelType.POST_IMAGE) {
      return `/${join(POST_PUBLIC_IMAGE_PATH, value)}`;
    } else {
      return value;
    }
  })
  fileName: string;

  @OneToOne(() => SongPostModel)
  songPost: SongPostModel;
}
