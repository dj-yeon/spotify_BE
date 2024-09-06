import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { UsersModel } from 'src/users/entity/users.entity';
import { User } from 'src/users/decorator/user.decorator';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginte-post.dto';
import { ImageModelType } from 'src/common/entity/image.entity';
import { DataSource, QueryRunner as QR } from 'typeorm';
import { PostsImagesService } from './image/images.service';
import { LogInterceptor } from 'src/common/interceptor/log.interceptor';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { QueryRunner } from 'src/common/decorator/query-runner.decorator';
import { PostsSongsService } from './song/songs.service';
import { SongModelType } from 'src/common/entity/song.entity';
import { CreateSongPostDto } from './dto/create-song-post.dto';
import { SongPostModel } from './entity/songPost.entity';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly dataSource: DataSource,
    private readonly postImageService: PostsImagesService,
    private readonly postSongService: PostsSongsService,
  ) {}

  // @Get()
  // @UseInterceptors(LogInterceptor)
  // getPosts(@Query() query: PaginatePostDto) {
  //   return this.postsService.paginatePosts(query);
  // }

  @Get()
  async findAll(): Promise<SongPostModel[]> {
    return this.postsService.getSongs();
  }

  @Post('song')
  @UseGuards(AccessTokenGuard)
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

  // PATCH METHOD
  @Patch(':id')
  patchPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePostDto,
  ) {
    return this.postsService.updatePost(id, body);
  }

  //DELETE METHOD
  @Delete(':id')
  deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.deletePost(id);
  }

  @Get('getLikedSongs')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  async getLikedSongs(@User() user: UsersModel) {
    return this.postsService.getLikedSongs(user.email);
  }

  @Get('isLikedSong/:songId')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  async isLiked(@User() user: UsersModel, @Param('songId') songId: string) {
    console.log('**** songId', songId);

    return { isLiked: await this.postsService.isLikedSong(user.email, songId) };
  }

  @Post('likedSong')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  async addLike(@User() user: UsersModel, @Body('songId') songId: string) {
    await this.postsService.addLike(user.email, songId);
    return { message: 'Liked successfully' };
  }

  @Delete('likedSong/:songId')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  async removeLike(@User() user: UsersModel, @Param('songId') songId: string) {
    await this.postsService.removeLike(user.email, songId);
    return { message: 'Like removed successfully' };
  }

  @Get('getSongsByUserId')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  async getSongsByUserId(@User() user: UsersModel) {
    return this.postsService.getSongsByUserId(user.email);
  }
}
