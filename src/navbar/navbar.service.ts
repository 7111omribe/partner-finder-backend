// src/users/users.service.ts

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { searchLocationDto } from 'src/dtos/navbar.dto';
import { PostgreSQLInterface } from 'src/tools/connections/postresqlcon';

const db = new PostgreSQLInterface("postresql");

@Injectable()
export class NavbarService {

    async searchLocation(userDto: searchLocationDto): Promise<{ results?: any }> {
        try {
            const query: string = `
            select l.location_id,
	               l.location_name,
	               c.country_name,
            	   c.country_flag
            from locations l
            join countries c
            on l.country_id = c.country_id
            and l.location_name||', '||c.country_name like '%${userDto.searchText}%' 
            `
            let queryRawResults = await db.queryDB(query);
            if (queryRawResults.rowCount === 0) {
                throw new HttpException('No results', HttpStatus.NO_CONTENT);
            }
            return { results: queryRawResults.rows }
        } catch (error) { // todo change all exception throwing
            if (error instanceof HttpException) { throw error; }
            throw new HttpException("Failed to search", error.HttpStatus);
        }
    }
}
