import { FindManyOptions } from 'typeorm';
import { SongPostModel } from '../entity/songPost.entity';

export const DEFAULT_POST_FIND_OPTIONS: FindManyOptions<SongPostModel> = {
  relations: {
    user: true,
    // image: true,
    // song: true,
  },
};
