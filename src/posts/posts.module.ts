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
import { PostsMusicsService } from './music/musics.service';
import { MusicModel } from 'src/common/entity/music.entity';
import { LikedSong } from './entity/likedSong.entity';
import { Price } from './entity/price.entity';
import { Product } from './entity/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostsModel,
      ImageModel,
      MusicModel,
      LikedSong,
      Price,
      Product,
    ]),
    AuthModule,
    UsersModule,
    CommonModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsImagesService, PostsMusicsService],
})
export class PostsModule {}
