import { Column, Entity, OneToMany } from 'typeorm';
import { RolesEnum } from '../const/roles.const';
import { PostsModel } from 'src/posts/entity/posts.entity';
import { BaseModel } from 'src/common/entity/base.entity';
import { IsEmail, IsString, Length } from 'class-validator';
import { lengthValidationMessage } from 'src/common/validation-message/length-validation.message';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';
import { Exclude } from 'class-transformer';
import { Subscription } from './subscription.entity';
import { LikedSong } from 'src/posts/entity/likedSong.entity';
import { SongPostModel } from 'src/posts/entity/songPost.entity';

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
  @IsString({ message: stringValidationMessage })
  @IsEmail({}, { message: stringValidationMessage })
  email: string;

  @Column()
  @IsString()
  @Length(3, 8, { message: lengthValidationMessage })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({
    enum: Object.values(RolesEnum),
    default: RolesEnum.USER,
  })
  role: RolesEnum;

  // @Expose()
  // get nicknameAndEmail() {
  //   return this.nickname + '/' + this.email;
  // }

  @OneToMany(() => PostsModel, (post) => post.author)
  posts: PostsModel[];

  // @OneToMany(() => CommentsModel, (comment) => comment.author)
  // postComments: CommentsModel[];

  @OneToMany(() => LikedSong, (likedSong) => likedSong.user)
  likedSongs: LikedSong[];

  @OneToMany(() => SongPostModel, (song) => song.user)
  songs: SongPostModel[];

  @OneToMany(() => Subscription, (subscription) => subscription.user)
  subscriptions: Subscription[];
}
