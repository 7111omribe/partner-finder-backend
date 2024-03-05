

import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { GetPostsDto, JoinGroupDto } from '../dtos/posts.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }
    @Post("/getMyPosts")
    @HttpCode(200)
    async getUserPosts(@Body() getPostsDto: GetPostsDto): Promise<any> {
        return this.postsService.getUserPosts(getPostsDto);
    }
    @Post("/getOthersPosts")
    @HttpCode(200)
    async getOthersPosts(@Body() getPostsDto: GetPostsDto): Promise<any> {
        return this.postsService.getOthersPosts(getPostsDto);
    }
    @Post("/joinGroup")
    @HttpCode(201)
    async joinGroup(@Body() joinGroupDto: JoinGroupDto): Promise<any> {
        return this.postsService.joinGroup(joinGroupDto);
    }
    @Post("/leaveGroup")
    @HttpCode(201)
    async leaveGroup(@Body() joinGroupDto: JoinGroupDto): Promise<any> {
        return this.postsService.leaveGroup(joinGroupDto);
    }
}
