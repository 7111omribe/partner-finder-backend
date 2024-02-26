

import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CreatePostsService } from './createPosts.service';

@Controller('createPosts')
export class CreatePostsController {
    constructor(private readonly postsService: CreatePostsService) { }
    @Post("/createPost")
    @HttpCode(200)
    async createPost(@Body() createPostDto: Record<string, any>): Promise<any> {
        return this.postsService.createPost(createPostDto);
    }
}
