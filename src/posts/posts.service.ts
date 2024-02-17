import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MongoInterface } from 'src/tools/connections/mongoCon';
import { GetPostsDto, LoginDto } from '../dtos/posts.dto';

const conn = new MongoInterface('partnerFinder');

@Injectable()
export class PostsService {
    async getUserPosts(getPostsDto: GetPostsDto): Promise<{ message: string, adminPosts: Record<string, any>[], othersPosts: Record<string, any>[] }> {
        try {
            const posts = await conn.aggregate('posts', [
                {
                    '$match': {
                        'activityData.locationId': getPostsDto.locationId,
                        'statusData.attendencies': { $elemMatch: { 'userId': getPostsDto.userId } }
                    }
                }
            ])
            const adminPosts = [];
            const otherPosts = [];
            for (const post of posts) {
                if (post['creationData']['adminId'] === getPostsDto.userId) {
                    adminPosts.push(post)
                } else {
                    otherPosts.push(post)
                }
            }
            return { message: 'OK', adminPosts: adminPosts, othersPosts: otherPosts }
        } catch (error) {
            if (error instanceof HttpException) { throw error; }
            throw new HttpException("Failed to run query", error.HttpStatus);
        }
    }
}
