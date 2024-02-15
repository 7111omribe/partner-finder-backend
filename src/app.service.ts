import { Injectable } from '@nestjs/common';
import { PostgreSQLInterface } from 'src/tools/connections/postresqlcon'
import { CreateUserDto, DeleteUserDto } from './dtos/users.dto';




@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!2';
  }

  
}
