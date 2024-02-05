import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto } from './users/dto/create_user.dto';

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
}
