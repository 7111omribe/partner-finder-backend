

import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto, DeleteUserDto } from './dto/users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post("/add_user")
    async addUser(@Body() createUserDto: CreateUserDto): Promise<any> {
        return this.usersService.addUser(createUserDto);
    }

    @Post("/delete_user")
    async deleteUser(@Body() deleteUserDto: DeleteUserDto): Promise<any> {
        return this.usersService.deleteUser(deleteUserDto);
    }
}
