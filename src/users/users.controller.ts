

import { Body, Controller, Post, HttpCode } from '@nestjs/common';
import { ChangePasswordDto, CreateUserDto, DeleteUserDto, LoginDto } from '../dtos/users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post("/sign_up")
    async addUser(@Body() createUserDto: CreateUserDto): Promise<any> {
        return this.usersService.createUser(createUserDto);
    }

    @Post("/delete_account")
    async deleteUser(@Body() deleteUserDto: DeleteUserDto): Promise<any> {
        return this.usersService.deleteAccount(deleteUserDto);
    }
    @Post("/change_password")
    async changePassword(@Body() changePasswordDto: ChangePasswordDto): Promise<any> {
        return this.usersService.changePassword(changePasswordDto);
    }

    @Post("/log_in")
    @HttpCode(200)
    async logIn(@Body() userDto: LoginDto): Promise<any> {
        return this.usersService.logIn(userDto);
    }
}
