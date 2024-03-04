import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MongoInterface } from 'src/tools/connections/mongoCon';
import { GetPostsDto, JoinGroupDto } from '../dtos/posts.dto';
import { ObjectId } from 'mongodb';

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
    async joinGroup(joinGroupDto: JoinGroupDto): Promise<{ message: string }> {
        const idFilter = { _id: new ObjectId(joinGroupDto.postId) }
        const maxUserNumInPost = await conn.aggregate('posts', [
            {
                $match: idFilter,
            },
            {
                $project: {
                    maxUserNumInPost: { $max: '$statusData.attendencies.userNumInPost' },
                },
            },
        ]);

        const newUserNumInPost = maxUserNumInPost[0]?.maxUserNumInPost + 1 || 1;

        await conn.update('posts', idFilter, {
            $push: {
                'statusData.attendencies': {
                    userId: joinGroupDto.userId,
                    num: joinGroupDto.friendsNum + 1,
                    userNumInPost: newUserNumInPost,
                },
            },
        });

        return { message: 'OK' };
    }


    async joinGroup2(joinGroupDto: JoinGroupDto): Promise<{ message: string }> {

        const resp = await conn.aggregate('posts', [
            {
                '$match': {
                    _id: joinGroupDto.postId,
                },
            },
            {
                '$push': {
                    'statusData.attendencies': {
                        userId: joinGroupDto.userId,
                        num: joinGroupDto.friendsNum + 1,
                        userNumInPost: { '$add': [{ '$max': '$statusData.attendencies.userNumInPost' }, 1] },
                    },
                },
            },
            {
                '$merge': 'posts',
            },
        ])
        return { message: 'OK' }

    }
}
