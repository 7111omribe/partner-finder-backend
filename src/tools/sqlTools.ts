import { HttpException, HttpStatus } from "@nestjs/common";

export function valToSql(val: any): string {
    if (typeof val === 'number') {
        return `${val}`;
    } else if (typeof val === 'string') {
        return `'${val}'`;
    } else if (typeof val === 'boolean') {
        return `${val}`;
    } else {
        throw new HttpException(`type ${typeof val} is not handled in valToSql func`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
}