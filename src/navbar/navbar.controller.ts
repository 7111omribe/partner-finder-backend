

import { Body, Controller, Post, HttpCode } from '@nestjs/common';
import { NavbarService } from './navbar.service';
import { ChooseLocationDto, SearchLocationDto } from 'src/dtos/navbar.dto';

@Controller('navbar')
export class NavbarController {
    constructor(private readonly navbarService: NavbarService) { }



    @Post("/search_location")
    @HttpCode(200)
    async searchLocation(@Body() searchTextDto: SearchLocationDto): Promise<any> {
        return this.navbarService.searchLocation(searchTextDto);
    }
    @Post("/change_location")
    @HttpCode(200)
    async changeLocation(@Body() chooseLocationDto: ChooseLocationDto): Promise<any> {
        return this.navbarService.chooseLocation(chooseLocationDto);
    }
}
