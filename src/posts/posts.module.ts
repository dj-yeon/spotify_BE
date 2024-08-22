import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModel } from './entity/posts.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { CommonModule } from 'src/common/common.module';
import { ImageModel } from 'src/common/entity/image.entity';
import { PostsImagesService } from './image/images.service';
import { PostsSongsService } from './song/songs.service';
import { LikedSong } from './entity/likedSong.entity';
import { Price } from './entity/price.entity';
import { Product } from './entity/product.entity';
import { SongModel } from 'src/common/entity/song.entity';
import { SongPostModel } from './entity/songPost.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostsModel,
      ImageModel,
      SongModel,
      LikedSong,
      Price,
      Product,
      SongPostModel,
    ]),
    AuthModule,
    UsersModule,
    CommonModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsImagesService, PostsSongsService],
})
export class PostsModule {}
