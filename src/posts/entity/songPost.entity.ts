import { UsersModel } from 'src/users/entity/users.entity';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { LikedSong } from './likedSong.entity';
import { BaseModel } from 'src/common/entity/base.entity';
import { ImageModel } from 'src/common/entity/image.entity';
import { SongModel } from 'src/common/entity/song.entity';
import { IsString } from 'class-validator';

@Entity()
export class SongPostModel extends BaseModel {
  @Column()
  @IsString()
  title: string | null;

  @Column()
  @IsString()
  author: string | null;₩

  @ManyToOne(() => UsersModel, (user) => user.email)
  user: UsersModel;

  @OneToMany(() => LikedSong, (likedSong) => likedSong.song)
  likedByUsers: LikedSong[];

  @OneToMany(() => ImageModel, (image) => image.songPost)
  image: ImageModel;

  @OneToMany(() => SongModel, (song) => song.songPost)
  song: SongModel;
}
