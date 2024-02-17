

import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { GetPostsDto } from '../dtos/posts.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }
    @Post("/getPosts")
    @HttpCode(200)
    async logIn(@Body() getPostsDto: GetPostsDto): Promise<any> {
        return this.postsService.getUserPosts(getPostsDto);
    }
}
