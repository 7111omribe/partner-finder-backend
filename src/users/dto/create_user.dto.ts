export class CreateUserDto {
    readonly email: string;
    readonly name: string;
    readonly password: string;
}
export class DeleteUserDto {
    readonly email: string;
    readonly password: string;
}