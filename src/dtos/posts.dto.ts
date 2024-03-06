export class GetPostsDto {
    readonly userId: number;
    readonly locationId: number;
}

export class JoinGroupDto {
    readonly userId: number;
    readonly postId: number;
    readonly friendsNum: number;
}
export class EditPostDataDto {
    readonly postId: string;
    readonly path: string;
    readonly newValue: any;
}