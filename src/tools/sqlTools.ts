export function valToSql(val: any): string {
    if (typeof val === 'number') {
        return `${val}`;
    } else if (typeof val === 'string') {
        return `'${val}'`;
    } else {
        return 'error!'
    }
}