export interface InputObject {
    userId: any;
    activityId?: string;
    locationId: any;
    title: string;
    description: string;
    activityTime?: string;
    activityDate?: string;
    minParticipants?: string;
    maxParticipants?: any;
    alreayMembersNum: any;
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