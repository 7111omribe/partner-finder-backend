import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto, DeleteUserDto } from './dtos/users.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get("/im_alive")
  getHello(): string {
    return this.appService.getHello();
  }


}
