import { Module } from '@nestjs/common';
import { CreatePostsController } from './createPosts.controller';
import { CreatePostsService } from './createPosts.service';

@Module({
  controllers: [CreatePostsController],
  providers: [CreatePostsService],
})
export class CreatePostsModule {}
