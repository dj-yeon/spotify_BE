import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryRunner, Repository } from 'typeorm';
import { PostsModel } from './entity/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CommonService } from 'src/common/common.service';
import { PaginatePostDto } from './dto/paginte-post.dto';
import { ImageModel } from 'src/common/entity/image.entity';
import { DEFAULT_POST_FIND_OPTIONS } from './const/default-post-find-options.const';
import { SongPostModel } from './entity/songPost.entity';
import { CreateSongPostDto } from './dto/create-song-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostsModel>,
    @InjectRepository(SongPostModel)
    private readonly songPostRepository: Repository<SongPostModel>,
    @InjectRepository(ImageModel)
    private readonly imageRepository: Repository<ImageModel>,
    private readonly commonService: CommonService,
  ) {}

  async getAllPosts() {
    this.songPostRepository.find({
      ...DEFAULT_POST_FIND_OPTIONS,
    });
  }

  async getPostById(email: string, qr?: QueryRunner) {
    const repository = this.getSongRepository(qr);

    const post = await repository.findOne({
      ...DEFAULT_POST_FIND_OPTIONS,
      where: {
        user: {
          email: email, // 또는 간단하게 email 만 사용해도 무방
        },
      },
    });

    if (!post) {
      throw new NotFoundException();
    }

    return post;
  }

  getRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<SongPostModel>(SongPostModel)
      : this.postsRepository;
  }

  // async createPost(authorId: number, postDto: CreatePostDto, qr?: QueryRunner) {
  //   // 1) create -> 저장할 객체를 생성한다.
  //   // 2) save -> 객체를 저장한다. (create 메서드에서 생성한 객체로))

  //   const repository = this.getRepository(qr);

  //   const post = repository.create({
  //     author: {
  //       id: authorId,
  //     },
  //     ...postDto,
  //     image: null,
  //     song: null,
  //     likeCount: 0,
  //     commentCount: 0,
  //   });

  //   const newPost = await repository.save(post);

  //   return newPost;
  // }

  getSongRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<SongPostModel>(SongPostModel)
      : this.songPostRepository;
  }

  async createSongPost(
    email: string,
    songDto: CreateSongPostDto,
    qr?: QueryRunner,
  ) {
    // 1) create -> 저장할 객체를 생성한다.
    // 2) save -> 객체를 저장한다. (create 메서드에서 생성한 객체로))

    const repository = this.getSongRepository(qr);

    const post = repository.create({
      user: {
        email,
      },
      ...songDto,
      image: null,
      song: null,
    });

    const newPost = await repository.save(post);

    return newPost;
  }

  async updatePost(postId: number, postDto: UpdatePostDto) {
    const { title, content } = postDto;

    // save의 기능
    // 1) 만약 데이터 존재, (id 기준으로) 새로 생성한다.
    // 2) 만약 데이터 존재X, (같은 id 값이 존재한다면) 존재하는 값을 업데이트한다.

    const post = await this.postsRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException();
    }

    if (title) {
      post.title = title;
    }

    if (content) {
      post.content = content;
    }

    const newPost = await this.postsRepository.save(post);

    return newPost;
  }

  async deletePost(postId: number) {
    const post = await this.postsRepository.findOne({ where: { id: postId } });

    if (!post) {
      throw new NotFoundException();
    }

    await this.postsRepository.delete(postId);

    return postId;
  }

  // 1) 오름차 순으로 정렬하는 pagination만 구현한다
  async paginatePosts(dto: PaginatePostDto) {
    return this.commonService.paginate(
      dto,
      this.songPostRepository,
      {
        ...DEFAULT_POST_FIND_OPTIONS,
      },
      'posts',
    );
  }
}
