import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MongoInterface } from 'src/tools/connections/mongoCon';
import { GetPostsDto } from '../dtos/posts.dto';

const conn = new MongoInterface('partnerFinder');

@Injectable()
export class PostsService {
    async getUserPosts(getPostsDto: GetPostsDto): Promise<{ message: string, results: Record<string, any>[] }> {
        try {
            const posts = await conn.aggregate('posts', [
                {
                    '$match': {
                        'activityData.locationId': getPostsDto.locationId,
                        'statusData.attendencies': { $elemMatch: { 'userId': getPostsDto.userId } }
                    }
                }
            ])
            if (posts.length === 0) {
                throw new HttpException('No results', HttpStatus.NO_CONTENT);
            }
            return { message: 'OK', results: posts }
        } catch (error) {
            if (error instanceof HttpException) { throw error; }
            throw new HttpException("Failed to run query", error.HttpStatus);
        }
    }
    async getOthersPosts(getPostsDto: GetPostsDto): Promise<{ message: string, results: Record<string, any>[] }> {
        try {
            const posts = await conn.aggregate('posts', [
                {
                    '$match': {
                        'activityData.locationId': getPostsDto.locationId,
                        'statusData.attendencies': { '$not': { $elemMatch: { 'userId': getPostsDto.userId } } }
                    }
                }
            ])
            if (posts.length === 0) {
                throw new HttpException('No results', HttpStatus.NO_CONTENT);
            }
            return { message: 'OK', results: posts }
        } catch (error) {
            if (error instanceof HttpException) { throw error; }
            throw new HttpException("Failed to run query", error.HttpStatus);
        }
    }
    async createPost(createPostDto: Record<string, any>): Promise<{ message: string, newId: string }> {
        const doc = {
            activityData:{
                
            }
        }
        const resp = await conn.insert('posts', createPostDto)
        if (resp.acknowledged === false) {
            throw new HttpException('error on mongo insertion', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return { message: 'OK', newId: resp.insertedId.toString() }

    }
}
