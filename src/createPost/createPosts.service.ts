import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MongoInterface } from 'src/tools/connections/mongoCon';

const conn = new MongoInterface('partnerFinder');

@Injectable()
export class CreatePostsService {
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
