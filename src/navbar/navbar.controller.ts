

import { Body, Controller, Post, HttpCode } from '@nestjs/common';
import { NavbarService } from './navbar.service';
import { searchLocationDto } from 'src/dtos/navbar.dto';

@Controller('navbar')
export class NavbarController {
    constructor(private readonly navbarService: NavbarService) { }



    @Post("/search_location")
    @HttpCode(200)
    async logIn(@Body() searchTextDto: searchLocationDto): Promise<any> {
        return this.navbarService.searchLocation(searchTextDto);
    }
}
