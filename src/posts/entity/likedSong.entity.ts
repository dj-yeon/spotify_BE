import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Song } from './song.entity';
import { UsersModel } from 'src/users/entity/users.entity';

@Entity('liked_songs')
export class LikedSong {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' })
  created_at: Date;

  @ManyToOne(() => UsersModel, (user) => user.likedSongs)
  user: UsersModel;

  @ManyToOne(() => Song, (song) => song.likedByUsers)
  song: Song;
}
