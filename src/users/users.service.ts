// src/users/users.service.ts

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, DeleteUserDto } from './dto/users.dto';
import { PostgreSQLInterface } from 'src/tools/connections/postresqlcon';
import { valToSql } from 'src/tools/sqlTools';

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
    async logIn(userDto: DeleteUserDto): Promise<{ message: string, userData?: any }> {
        try {
            const db = new PostgreSQLInterface("postresql");
            let queryRawResults = await db.queryDB(`
            select *
            from users_data
            where email = ${valToSql(userDto.email)}
            and is_deleted = false
            `);
            if (queryRawResults.rowCount === 0) {
                throw new HttpException('User is not exist', HttpStatus.NOT_FOUND);
            }
            const myRow = queryRawResults.rows[0];
            if (myRow.password === userDto.password) {
                return { message: 'user is valid!', userData: myRow }
            } else {
                throw new HttpException('Wrong Password', HttpStatus.UNAUTHORIZED);
            }
        } catch (error) { // todo change all exception throwing
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException("Failed to log in", error.HttpStatus);
        }
    }
    async deleteUser2(deleteUserDto: DeleteUserDto): Promise<{ message: string }> {
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
