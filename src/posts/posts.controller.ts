import {
  Body,
  Controller,
  Delete,
  Get,
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
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginte-post.dto';
import { ImageModelType } from 'src/common/entity/image.entity';
import { DataSource, QueryRunner as QR } from 'typeorm';
import { PostsImagesService } from './image/images.service';
import { LogInterceptor } from 'src/common/interceptor/log.interceptor';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { QueryRunner } from 'src/common/decorator/query-runner.decorator';
import { PostsMusicsService } from './music/musics.service';
import { MusicModelType } from 'src/common/entity/music.entity';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly dataSource: DataSource,
    private readonly postImageService: PostsImagesService,
    private readonly postMusicService: PostsMusicsService,
  ) {}

  @Get()
  @UseInterceptors(LogInterceptor)
  getPosts(@Query() query: PaginatePostDto) {
    return this.postsService.paginatePosts(query);
  }

  // ':': pathParameter
  @Get(':id')
  @UseInterceptors(LogInterceptor)
  // @UseFilters(HttpExceptionFilter)
  getPost(@Param('id', ParseIntPipe) id: number) {
    //    throw new BadRequestException('test error');

    return this.postsService.getPostById(id);
  }

  // POST METHOD
  @Post()
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  async postPosts(
    @User() user: UsersModel,
    @Body() body: CreatePostDto,
    @QueryRunner() qr: QR,
  ) {
    const post = await this.postsService.createPost(user.id, body, qr);

    await this.postImageService.createPostImage(
      {
        post,
        path: body.image,
        type: ImageModelType.POST_IMAGE,
      },
      qr,
    );

    await this.postMusicService.createPostMusic(
      {
        post,
        path: body.image,
        type: MusicModelType.POST_MUSIC,
      },
      qr,
    );

    console.log('user', user);

    return this.postsService.getPostById(post.id, qr);
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
}
