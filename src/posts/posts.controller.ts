

import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { GetPostsDto } from '../dtos/posts.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }
    @Post("/getMyPosts")
    @HttpCode(200)
    async getUserPosts(@Body() getPostsDto: GetPostsDto): Promise<any> {
        return this.postsService.getUserPosts(getPostsDto);
    }
}
