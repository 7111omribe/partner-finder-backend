// src/users/users.service.ts

import { Injectable } from '@nestjs/common';
import { CreateUserDto, DeleteUserDto } from './dto/users.dto';
import { PostgreSQLInterface } from 'src/tools/connections/postresqlcon';

@Injectable()
export class UsersService {
    async addUser(createUserDto: CreateUserDto): Promise<{ message: string }> {
        try {
          const db = new PostgreSQLInterface("postresql");
          await db.addRow("users_data", { name: createUserDto.name, email: createUserDto.email, password: createUserDto.password });
          return { message: 'User created successfully' };
        } catch (error) {
          console.error('Error adding user:', error);
          throw new Error('Failed to add user'); 
        }
      }
      async deleteUser(deleteUserDto: DeleteUserDto): Promise<{ message: string }> {
        try {
          const db = new PostgreSQLInterface("postresql");
          await db.deleteRows("users_data", { email: deleteUserDto.email });
          return { message: 'User deleted successfully' };
        } catch (error) {
          console.error('Error deleting user:', error);
          throw new Error('Failed to delete user');
        }
      }
}
