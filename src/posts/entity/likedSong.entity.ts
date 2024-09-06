import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UsersModel } from 'src/users/entity/users.entity';
import { SongPostModel } from './songPost.entity';
import { BaseModel } from 'src/common/entity/base.entity';

@Entity()
export class LikedSong extends BaseModel {
  @ManyToOne(() => UsersModel, (user) => user.likedSongs)
  @JoinColumn({ name: 'userEmail', referencedColumnName: 'email' })
  user: UsersModel;

  @ManyToOne(() => SongPostModel, (song) => song.id)
  song: SongPostModel;
}
