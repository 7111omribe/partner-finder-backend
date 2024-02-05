// src/users/users.service.ts

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, DeleteUserDto } from './dto/users.dto';
import { PostgreSQLInterface } from 'src/tools/connections/postresqlcon';
import { valToSql } from 'src/tools/sqlTools';

const db = new PostgreSQLInterface("postresql");

@Injectable()
export class UsersService {
    async createUser(createUserDto: CreateUserDto): Promise<{ message: string }> {
        try {
            let queryRawResults = await db.queryDB(`
            select *
            from users_data
            where email = ${valToSql(createUserDto.email)}
            and is_deleted = false
            `);
            if (queryRawResults.rowCount > 0) {
                throw new HttpException('User is already exist', HttpStatus.CONFLICT);
            }
            await db.addRow("users_data", createUserDto);
            return { message: 'User created successfully' };
        } catch (error) {
            if (error instanceof HttpException) { throw error; }
            throw new HttpException("Failed to create user", error.HttpStatus);
        }
    }
    async deleteUser(deleteUserDto: DeleteUserDto): Promise<{ message: string }> {
        try {
            await db.editTable("users_data", { email: deleteUserDto.email }, { is_deleted: true });
            return { message: 'User deleted successfully' };
        } catch (error) {
            if (error instanceof HttpException) { throw error; }
            throw new HttpException("Failed to delete user", error.HttpStatus);
        }
    }
    async logIn(userDto: DeleteUserDto): Promise<{ message: string, userData?: any }> {
        try {
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
            if (error instanceof HttpException) { throw error; }
            throw new HttpException("Failed to log in", error.HttpStatus);
        }
    }
}
