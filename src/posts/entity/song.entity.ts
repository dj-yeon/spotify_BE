import { UsersModel } from 'src/users/entity/users.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { LikedSong } from './likedSong.entity';

@Entity('songs')
export class Song {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', nullable: true })
  title: string | null;

  @Column({ type: 'varchar', nullable: true })
  author: string | null;

  @Column({ type: 'varchar', nullable: true })
  song_path: string | null;

  @Column({ type: 'varchar', nullable: true })
  image_path: string | null;

  @Column({ type: 'timestamp' })
  created_at: Date;

  @ManyToOne(() => UsersModel, (user) => user.songs)
  user: UsersModel;

  @OneToMany(() => LikedSong, (likedSong) => likedSong.song)
  likedByUsers: LikedSong[];
}
