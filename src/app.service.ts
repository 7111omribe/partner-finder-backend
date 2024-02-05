import { Injectable } from '@nestjs/common';
import { PostgreSQLInterface } from 'src/tools/connections/postresqlcon'
import { CreateUserDto } from './users/dto/create_user.dto';




@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!2';
  }
  async addUser(createUserDto: CreateUserDto): Promise<{ message: string }> {
    try {
      const db = new PostgreSQLInterface("postresql");
      await db.addRow("users_data", { name: createUserDto.name, email: createUserDto.email, password: createUserDto.password });
      return { message: 'User created successfully' };
    } catch (error) {
      console.error('Error adding user:', error);
      throw new Error('Failed to add user'); // Adjust error handling as needed
    }
  }
  
}
