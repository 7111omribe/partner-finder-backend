

import { Body, Controller, Post, HttpCode } from '@nestjs/common';
import { GetAttractionsDto } from 'src/dtos/activities.dto';
import { ActivitiesService } from './activities.service';

@Controller('activities')
export class ActivitiesController {
    constructor(private readonly usersService: ActivitiesService) { }

    @Post("/get_activities")
    @HttpCode(200)
    async addUser(@Body() getAttractionsDto: GetAttractionsDto): Promise<any> {
        return this.usersService.getLocActivities(getAttractionsDto);
    }

}
