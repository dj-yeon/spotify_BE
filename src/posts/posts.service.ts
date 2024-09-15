import { Injectable, NotFoundException } from '@nestjs/common';
import { Like, QueryRunner, Repository } from 'typeorm';
import { PostsModel } from './entity/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
// import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CommonService } from 'src/common/common.service';
import { PaginatePostDto } from './dto/paginte-post.dto';
import { ImageModel } from 'src/common/entity/image.entity';
import { DEFAULT_POST_FIND_OPTIONS } from './const/default-post-find-options.const';
import { SongPostModel } from './entity/songPost.entity';
import { CreateSongPostDto } from './dto/create-song-post.dto';
import { LikedSong } from './entity/likedSong.entity';

@Injectable()
export class PostsService {
  constructor(
    private readonly commonService: CommonService,
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostsModel>,
    @InjectRepository(SongPostModel)
    private readonly songPostRepository: Repository<SongPostModel>,
    @InjectRepository(ImageModel)
    private readonly imageRepository: Repository<ImageModel>,
    @InjectRepository(LikedSong)
    private likedSongRepository: Repository<LikedSong>,
  ) {}

  async getAllPosts() {
    this.songPostRepository.find({
      ...DEFAULT_POST_FIND_OPTIONS,
    });
  }

  // async getSongs(): Promise<SongPostModel[]> {
  //   return this.songPostRepository.find({
  //     order: {
  //       createdAt: 'DESC',
  //     },
  //     ...DEFAULT_POST_FIND_OPTIONS,
  //   });
  // }

  async getSongs(query: PaginatePostDto, path: string): Promise<any> {
    return this.commonService.paginate(
      query,
      this.songPostRepository,
      {},
      path,
    );
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

  getSongRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<SongPostModel>(SongPostModel)
      : this.songPostRepository;
  }

  async createSongPost(
    email: string,
    songPostDto: CreateSongPostDto,
    qr?: QueryRunner,
  ) {
    // 1) create -> 저장할 객체를 생성한다.
    // 2) save -> 객체를 저장한다. (create 메서드에서 생성한 객체로))

    const repository = this.getSongRepository(qr);

    const post = repository.create({
      user: {
        email,
      },
      ...songPostDto,
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

  async getLikedSongs(userEmail: string): Promise<SongPostModel[]> {
    const likedSongList = await this.likedSongRepository.find({
      where: {
        user: { email: userEmail },
      },
      relations: ['song'],
    });

    return likedSongList.map((likedSong) => likedSong.song);
  }

  async isLikedSong(userEmail: string, songId: string): Promise<boolean> {
    const likedSong = await this.likedSongRepository.findOne({
      where: {
        user: { email: userEmail },
        song: { id: +songId },
      },
      relations: ['user', 'song'],
    });

    return !!likedSong;
  }

  async addLike(userEmail: string, songId: string): Promise<void> {
    const likedSong = this.likedSongRepository.create({
      user: { email: userEmail },
      song: { id: +songId },
    });

    await this.likedSongRepository.save(likedSong);
  }

  async removeLike(userEmail: string, songId: string): Promise<void> {
    const likedSong = await this.likedSongRepository.findOne({
      where: {
        user: { email: userEmail },
        song: { id: +songId },
      },
      relations: ['user', 'song'],
    });

    if (!likedSong) {
      throw new NotFoundException('Like not found');
    }

    await this.likedSongRepository.remove(likedSong);
  }

  async getSongsByUserId(userEmail: string): Promise<SongPostModel[]> {
    const mySongList = await this.songPostRepository.find({
      where: {
        user: { email: userEmail },
      },
    });

    return mySongList.map((songPost) => ({
      ...songPost,
      id: songPost.id,
      title: songPost.title,
      author: songPost.author,
      user: songPost.user,
      imageFileName: songPost.imageFileName,
      songFileName: songPost.songFileName,
      likedByUsers: songPost.likedByUsers,
      createdAt: songPost.createdAt,
      updatedAt: songPost.updatedAt,
    }));
  }

  async getSongsByTitle(
    userEmail: string,
    title: string,
  ): Promise<SongPostModel[]> {
    const mySongList = await this.songPostRepository.find({
      where: {
        title: Like(`%${title}%`),
      },
    });

    return mySongList.map((songPost) => ({
      ...songPost,
      id: songPost.id,
      title: songPost.title,
      author: songPost.author,
      user: songPost.user,
      imageFileName: songPost.imageFileName,
      songFileName: songPost.songFileName,
      likedByUsers: songPost.likedByUsers,
      createdAt: songPost.createdAt,
      updatedAt: songPost.updatedAt,
    }));
  }

  async isPostMine(userId: number, postId: number) {
    return this.postsRepository.exists({
      where: {
        id: postId,
        author: {
          id: userId,
        },
      },
      relations: {
        author: true,
      },
    });
  }
}
