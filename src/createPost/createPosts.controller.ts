

import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CreatePostsService } from './createPosts.service';
import { CreatePostDto, InputObject, SearchActivityDto } from 'src/dtos/createPosts.dto';

@Controller('postsActions')
export class CreatePostsController {
    constructor(private readonly postsService: CreatePostsService) { }
    @Post("/createPost")
    @HttpCode(201)
    async createPost(@Body() createPostDto:CreatePostDto): Promise<any> {
        return this.postsService.createPost(createPostDto);
    }
    @Post("/searchActivity")
    @HttpCode(200)
    async searchActivity(@Body() searchActivityDto:SearchActivityDto): Promise<any> {
        return this.postsService.searchActivity(searchActivityDto);
    }
}
