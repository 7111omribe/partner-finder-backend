export interface InputObject {
    userId: number;
    activityId?: string;
    locationId: number;
    title: string;
    description: string;
    activityType?: string;
    activityTime?: string;
    activityDate?: string;
    minParticipants?: string;
    maxParticipants?: number;
    myMembersNum: number;
}

export interface OutputObject {
    activityData: Record<string, any>;
    creationData: Record<string, any>;
    postData: Record<string, any>;
    statusData: Record<string, any>;
}

export class CreatePostDto {
    readonly formData: any;
    readonly userId: number;
    readonly locationId: number;
}

export class SearchActivityDto {
    readonly searchText: string;
    readonly locationId: number;
}