import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModel } from './entity/users.entity';
import { LikedSong } from 'src/posts/entity/likedSong.entity';
import { Subscription } from './entity/subscription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsersModel, LikedSong, Subscription])],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
