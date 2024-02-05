import { Injectable } from '@nestjs/common';
import { PostgreSQLInterface } from 'src/tools/connections/postresqlcon'
import { CreateUserDto, DeleteUserDto } from './users/dto/create_user.dto';




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
  async deleteUser(deleteUserDto: DeleteUserDto): Promise<{ message: string }> {
    try {
      const db = new PostgreSQLInterface("postresql");
      await db.deleteRows("users_data", { email: deleteUserDto.email });
      return { message: 'User deleted successfully' };
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user'); // Adjust error handling as needed
    }
  }
  
}
