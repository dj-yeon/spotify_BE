import { Column, Entity, OneToMany } from 'typeorm';
import { RolesEnum } from '../const/roles.const';
import { PostsModel } from 'src/posts/entity/posts.entity';
import { BaseModel } from 'src/common/entity/base.entity';
import { IsEmail, IsEnum, IsString, Length } from 'class-validator';
import { lengthValidationMessage } from 'src/common/validation-message/length-validation.message';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';
import { Exclude } from 'class-transformer';
import { Subscription } from './subscription.entity';
import { LikedSong } from 'src/posts/entity/likedSong.entity';
import { SongPostModel } from 'src/posts/entity/songPost.entity';
import { emailValidationMessage } from 'src/common/validation-message/email-validation.message';

@Entity()
export class UsersModel extends BaseModel {
  @Column({
    length: 20,
    unique: true,
  })
  @IsString({ message: stringValidationMessage })
  @Length(1, 20, { message: lengthValidationMessage })
  nickname: string;

  @Column({
    unique: true,
  })
  // @IsString({ message: stringValidationMessage })
  @IsEmail({}, { message: emailValidationMessage })
  email: string;

  @Column()
  @IsString()
  @Length(3, 8, { message: lengthValidationMessage })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({
    type: 'enum', // enum을 위한 type 설정 추가
    enum: RolesEnum, // enum 값
    default: RolesEnum.USER, // 기본값
  })
  @IsEnum(RolesEnum, { message: 'Invalid role. Must be USER or ADMIN' }) // IsEnum 데코레이터 추가
  role: RolesEnum;

  @OneToMany(() => PostsModel, (post) => post.author)
  posts: PostsModel[];

  @OneToMany(() => LikedSong, (likedSong) => likedSong.user)
  likedSongs: LikedSong[];

  @OneToMany(() => SongPostModel, (song) => song.user)
  songs: SongPostModel[];

  @OneToMany(() => Subscription, (subscription) => subscription.user)
  subscriptions: Subscription[];
}
