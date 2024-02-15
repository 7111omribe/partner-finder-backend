export class CreateUserDto {
    readonly email: string;
    readonly name: string;
    readonly password: string;
}
export class LoginDto {
    readonly email: string;
    readonly password: string;
}
export class DeleteUserDto {
    readonly userId: number;
    readonly password: string;
}
export class ChangePasswordDto {
    readonly userId: number;
    readonly newPassword: string;
}