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
        await conn.updateOne('posts', idFilter, {
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
    async leaveGroup(joinGroupDto: JoinGroupDto): Promise<{ message: string }> {
        const idFilter = { _id: new ObjectId(joinGroupDto.postId) }
        await conn.updateOne('posts', idFilter, {
            $pull: { 'statusData.attendencies': { userId: joinGroupDto.userId } }
        });
        await this.handleAdminLeaving(idFilter, joinGroupDto.userId)

        return { message: 'OK' };
    }

    private async handleAdminLeaving(postFilter: any, userId: number): Promise<any> {
        const doc = await conn.findOne("posts", postFilter)
        if (doc['creationData']['adminId'] == userId) {
            const members = doc['statusData']['attendencies']
            if (members.length > 0) {
                const newAdminId = members[0]['userId']
                const resp = await conn.updateOne('posts', postFilter, {
                    'creationData.adminId': newAdminId
                })
            }
            else {
                const resp = await conn.deleteOne('posts', postFilter)
            }
        }
    }
}
