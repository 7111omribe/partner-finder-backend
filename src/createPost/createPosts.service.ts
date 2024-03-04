import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto, InputObject, OutputObject, SearchActivityDto } from 'src/dtos/createPosts.dto';
import { MongoInterface } from 'src/tools/connections/mongoCon';
import { PostgreSQLInterface } from 'src/tools/connections/postresqlcon';

const db = new PostgreSQLInterface("postresql");


function cleanObject(obj: Record<string, any>): Record<string, any> {
    const cleanedObject: Record<string, any> = {};

    for (const key in obj) {
        if (obj[key] !== undefined && obj[key] !== null) {
            cleanedObject[key] = obj[key];
        }
    }

    return cleanedObject;
}

function transformObject(input: InputObject): OutputObject {
    const currentDate = new Date()

    const output: OutputObject = {
        activityData: cleanObject({
            activityId: input.activityId,
            title: input.title,
            description: input.description,
            activityTime: input.activityTime,
            locationId: input.locationId,
        }),
        creationData: cleanObject({
            insertionTime: currentDate,
            adminId: input.userId,
        }),
        postData: cleanObject({
            plannedDate: new Date(input.activityDate),
            minParticipantes: input.minParticipants ? parseInt(input.minParticipants, 10) : undefined,
            maxParticipants: input.maxParticipants,
        }),
        statusData: cleanObject({
            isCanceled: false,
            attendencies: [
                {
                    userId: input.userId,
                    num: input.myMembersNum,
                },
            ],
        }),
    };

    return output;
}



const conn = new MongoInterface('partnerFinder');

@Injectable()
export class CreatePostsService {
    async createPost(createPostDto: CreatePostDto): Promise<{ message: string, newId: string }> {
        ///todo add separated userId and locationId
        let parsedInput = createPostDto['formData']
        parsedInput['userId'] = createPostDto['userId']
        parsedInput['locationId'] = createPostDto['locationId']
        const doc = transformObject(parsedInput);
        const resp = await conn.insert('posts', doc) // todo add try catch to insert method
        if (resp.acknowledged === false) {
            throw new HttpException('error on mongo insertion', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return { message: 'OK', newId: resp.insertedId.toString() }

    }


    async searchActivity(searchActivityDto: SearchActivityDto): Promise<{ results?: any }> {
        try {
            const query: string = `
            select *
            from activities
            where location_id = ${searchActivityDto.locationId}
            and activity_name like '%${searchActivityDto.searchText}%' 
            `
            let queryRawResults = await db.queryDB(query);
            if (queryRawResults.rowCount === 0) {
                throw new HttpException('No results', HttpStatus.NO_CONTENT);
            }
            return { results: queryRawResults.rows }
        } catch (error) {
            if (error instanceof HttpException) { throw error; }
            throw new HttpException("Failed to search", error.HttpStatus);
        }
    }
}
