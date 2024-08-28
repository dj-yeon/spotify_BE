import { UsersModel } from 'src/users/entity/users.entity';
import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
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
  author: string | null;

  @ManyToOne(() => UsersModel, (user) => user.email)
  @JoinColumn({ name: 'userEmail', referencedColumnName: 'email' })
  user: UsersModel;

  @OneToMany(() => LikedSong, (likedSong) => likedSong.song)
  likedByUsers: LikedSong[];

  @Column({ nullable: true, default: 'default_image.jpg' })
  @IsString()
  imageFileName: string;

  @Column({ nullable: true, default: 'default_song.mp3' })
  @IsString()
  songFileName: string;
  // @OneToMany(() => ImageModel, (image) => image.songPost)
  // image: ImageModel;

  // @OneToMany(() => SongModel, (song) => song.songPost)
  // song: SongModel;

  // @ManyToOne(() => ImageModel)
  // @JoinColumn({ name: 'imageFileName', referencedColumnName: 'fileName' })
  // image: ImageModel;

  // @ManyToOne(() => SongModel)
  // @JoinColumn({ name: 'songFileName', referencedColumnName: 'fileName' })
  // song: SongModel;
}
