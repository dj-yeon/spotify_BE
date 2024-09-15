import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { UsersModel } from 'src/users/entity/users.entity';
import { User } from 'src/users/decorator/user.decorator';
import { PaginatePostDto } from './dto/paginte-post.dto';
import { ImageModelType } from 'src/common/entity/image.entity';
import { DataSource, QueryRunner as QR } from 'typeorm';
import { PostsImagesService } from './image/images.service';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { QueryRunner } from 'src/common/decorator/query-runner.decorator';
import { PostsSongsService } from './song/songs.service';
import { SongModelType } from 'src/common/entity/song.entity';
import { CreateSongPostDto } from './dto/create-song-post.dto';
import { IsPublic } from 'src/common/decorator/is-public.decorator';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly dataSource: DataSource,
    private readonly postImageService: PostsImagesService,
    private readonly postSongService: PostsSongsService,
  ) {}

  @Get()
  @IsPublic()
  async findAll(@Query() query: PaginatePostDto): Promise<any> {
    const path = 'posts'; // 커서 페이지네이션을 위한 URL 경로
    console.log('********* query', query);
    return this.postsService.getSongs(query, path);
  }

  @Post('song')
  // @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  async songPosts(
    @User() user: UsersModel,
    @Body() body: CreateSongPostDto,
    @QueryRunner() qr: QR,
  ) {
    try {
      const songPost = await this.postsService.createSongPost(
        user.email,
        body,
        qr,
      );

      await this.postImageService.createPostImage(
        {
          songPost,
          fileName: body.imageFileName,
          type: ImageModelType.POST_IMAGE,
        },
        qr,
      );

      await this.postSongService.createPostSong(
        {
          songPost,
          fileName: body.songFileName,
          type: SongModelType.POST_SONG,
        },
        qr,
      );

      return songPost;
    } catch (error) {
      console.error('Error in songPosts:', error);
      throw new InternalServerErrorException(
        'An error occurred while creating the song post',
      );
    }
  }

  @Get('getLikedSongs')
  // @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  async getLikedSongs(@User() user: UsersModel) {
    return this.postsService.getLikedSongs(user.email);
  }

  @Get('isLikedSong/:songId')
  // @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  async isLiked(@User() user: UsersModel, @Param('songId') songId: string) {
    return { isLiked: await this.postsService.isLikedSong(user.email, songId) };
  }

  @Post('likedSong')
  // @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  async addLike(@User() user: UsersModel, @Body('songId') songId: string) {
    await this.postsService.addLike(user.email, songId);
    return { message: 'Liked successfully' };
  }

  @Delete('likedSong/:songId')
  // @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  async removeLike(@User() user: UsersModel, @Param('songId') songId: string) {
    await this.postsService.removeLike(user.email, songId);
    return { message: 'Like removed successfully' };
  }

  @Get('getSongsByUserId')
  // @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  async getSongsByUserId(@User() user: UsersModel) {
    return this.postsService.getSongsByUserId(user.email);
  }

  @Get('getSongsByTitle')
  // @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  async getSongsByTitle(
    @User() user: UsersModel,
    @Query('title') title: string,
  ) {
    return this.postsService.getSongsByTitle(user.email, title);
  }
}
