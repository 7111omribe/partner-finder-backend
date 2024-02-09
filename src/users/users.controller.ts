

import { Body, Controller, Post, HttpCode } from '@nestjs/common';
import { CreateUserDto, DeleteUserDto } from './dto/users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post("/sign_up")
    async addUser(@Body() createUserDto: CreateUserDto): Promise<any> {
        return this.usersService.createUser(createUserDto);
    }

    @Post("/delete_user")
    async deleteUser(@Body() deleteUserDto: DeleteUserDto): Promise<any> {
        return this.usersService.deleteUser(deleteUserDto);
    }

    @Post("/log_in")
    @HttpCode(200)
    async logIn(@Body() userDto: DeleteUserDto): Promise<any> {
        return this.usersService.logIn(userDto);
    }
}
