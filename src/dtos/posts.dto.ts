export class GetPostsDto {
    readonly userId: number;
    readonly locationId: number;
}

export class JoinGroupDto {
    readonly userId: number;
    readonly postId: number;
    readonly friendsNum: number;
}