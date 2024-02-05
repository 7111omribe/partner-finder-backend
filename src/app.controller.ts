import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto, DeleteUserDto } from './users/dto/create_user.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get("/im_alive")
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("/add_user")
  async addUser(@Body() createUserDto: CreateUserDto): Promise<any> {
    return this.appService.addUser(createUserDto);
  }

  @Post("/delete_user")
  async deleteUser(@Body() deleteUserDto: DeleteUserDto): Promise<any> {
    return this.appService.deleteUser(deleteUserDto);
  }
}
