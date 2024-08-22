import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsersModel } from 'src/users/entity/users.entity';
import { SongPostModel } from './songPost.entity';

@Entity()
export class LikedSong {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' })
  created_at: Date;

  @ManyToOne(() => UsersModel, (user) => user.likedSongs)
  user: UsersModel;

  @ManyToOne(() => SongPostModel, (song) => song.likedByUsers)
  song: SongPostModel;
}
