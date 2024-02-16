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
            SELECT 
                a.activity_id,
                a.activity_name,
                a.activity_type,
                a.activity_description,
                a.img_path,
                a.activity_time,
                CASE WHEN COUNT(am.agent_id) > 0
                THEN JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'agent_id', am.agent_id,
                        'agent_name', am.agent_name,
                        'agent_phone', am.agent_phone
                    )
                ) ELSE '[]'::json
                END as agents
            FROM activities a
            LEFT JOIN agents_activities aa ON a.activity_id = aa.activity_id
            LEFT JOIN agents_meta am ON aa.agent_id = am.agent_id
            WHERE a.location_id = ${valToSql(getAttractionsDto.locationId)}
            GROUP BY a.activity_id, a.activity_name, a.activity_type, a.activity_description, a.img_path, a.activity_time
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
    async getLocAgents(getAttractionsDto: GetAttractionsDto): Promise<{ results?: any }> {
        try {
            let queryRawResults = await db.queryDB(`
            select m.*, a.activity_id
            from agents_meta m
            join agents_activities a
            on a.location_id = ${valToSql(getAttractionsDto.locationId)}
            and m.agent_id = a.agent_id
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
