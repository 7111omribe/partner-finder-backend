import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ChangePasswordDto, CreateUserDto, DeleteUserDto, LoginDto } from '../dtos/users.dto';
import { PostgreSQLInterface } from 'src/tools/connections/postresqlcon';
import { valToSql } from 'src/tools/sqlTools';
import { getFields } from 'src/tools/utils';

const db = new PostgreSQLInterface("postresql");

@Injectable()
export class UsersService {
    async createUser(createUserDto: CreateUserDto): Promise<{ message: string, userData?: any }> {
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
            return { message: 'User created successfully', userData: createUserDto };
        } catch (error) {
            if (error instanceof HttpException) { throw error; }
            throw new HttpException("Failed to create user", error.HttpStatus);
        }
    }
    async deleteAccount(deleteUserDto: DeleteUserDto): Promise<{ message: string }> {
        try {
            await db.editTable("users_data", { user_id: deleteUserDto.userId }, { is_deleted: true });
            return { message: 'User deleted successfully' };
        } catch (error) {
            if (error instanceof HttpException) { throw error; }
            throw new HttpException("Failed to delete user", error.HttpStatus);
        }
    }
    async changePassword(changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
        try {
            const db = new PostgreSQLInterface("postresql");
            await db.editTable("users_data", { user_id: changePasswordDto.userId }, { password: changePasswordDto.newPassword });
            return { message: 'User deleted successfully' };
        } catch (error) {
            if (error instanceof HttpException) { throw error; }
            throw new HttpException("Failed to change password", error.HttpStatus);
        }
    }
    async logIn(userDto: LoginDto): Promise<{ message: string, userData?: any, locationData?: any }> {
        const userFields = ['email', 'name', 'password', 'user_id'] // todo move to config
        const locationFields = ['location_id', 'location_name', 'location_picture']
        const countryFields = ['country_flag', 'country_name']
        try {
            const query: string = `
            with user_params as
            (
            select location_id, ${userFields.join(', ')}
            from users_data
            where email = ${valToSql(userDto.email)}
            and is_deleted = false
            )
            select ${userFields.join(', ')}, ${locationFields.map(f => 'l.' + f).join(', ')}, ${countryFields.map(f => 'c.' + f).join(', ')}
            from user_params u
            left join locations l
            on u.location_id = l.location_id
            left join countries c
            on l.country_id = c.country_id
            `
            let queryRawResults = await db.queryDB(query);
            if (queryRawResults.rowCount === 0) {
                throw new HttpException('User is not exist', HttpStatus.NOT_FOUND);
            }
            const myRow = queryRawResults.rows[0];
            if (myRow.password === userDto.password) {
                return {
                    message: 'user is valid!',
                    userData: getFields(myRow, userFields),
                    locationData: getFields(myRow, [...locationFields, ...countryFields])
                }
            } else {
                throw new HttpException('Wrong Password', HttpStatus.UNAUTHORIZED);
            }
        } catch (error) { // todo change all exception throwing
            if (error instanceof HttpException) { throw error; }
            throw new HttpException("Failed to log in", error.HttpStatus);
        }
    }
}
