import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GetAttractionsDto } from 'src/dtos/activities.dto';
import { PostgreSQLInterface } from 'src/tools/connections/postresqlcon';
import { valToSql } from 'src/tools/sqlTools';

const db = new PostgreSQLInterface("postresql");

@Injectable()
export class ActivitiesService {
    async getLocActivities(getAttractionsDto: GetAttractionsDto): Promise<{ results?: any }> {
        try {
            let queryRawResults = await db.queryDB(`
            select activity_id
                    ,activity_name
                    ,activity_type
                    ,activity_description
                    ,img_path
                    ,activity_time
            from activities
            where location_id = ${valToSql(getAttractionsDto.locationId)}
            `);
            if (queryRawResults.rowCount === 0) {
                throw new HttpException('No results', HttpStatus.NO_CONTENT);
            }
            return { results: queryRawResults.rows };
        } catch (error) {
            if (error instanceof HttpException) { throw error; }
            throw new HttpException("Failed to create user", error.HttpStatus);
        }
    }

}
