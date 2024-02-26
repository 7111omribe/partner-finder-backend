import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { APP_FILTER } from '@nestjs/core';
import { CustomExceptionFilter } from './custom-exception.filter';
import { NavbarModule } from './navbar/navbar.module';
import { ActivitiesModule } from './activities/activities.module';
import { PostsModule } from './posts/posts.module';
import { CreatePostsModule } from './createPost/createPosts.module';

@Module({
  imports: [UsersModule, NavbarModule, ActivitiesModule, PostsModule, CreatePostsModule],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_FILTER,
    useClass: CustomExceptionFilter,
  }],
})
export class AppModule { }
