export interface GetGroupResponse {
    success: true;
    message?: string;
    group: Group
}
export interface Group {
    id?: string;
    name?: string;
    description?: string;
    createdDate?: Date;
    owner?: Memeber;
    members?: Memeber[];
    image?: string;
}

export interface Memeber {
    userId?: string;
    name?: string;
    username?: string;
    email?: string;
    joinedDate?: Date;
    image?: string;
    aboutMe?: string
}

export interface GetGroupMessageListRequest {
    groupId?: string;
    pageIndex?: number;
    pageSize?: number;
}

export interface GetGroupMessageListResult {
    items: Message[];
    success: true;
    message?: string;
}

export interface Message {
    text: string;
    username: string;
    sentTime: string;
    userId: string; 
    isMe?:boolean;
}

export interface SendMessageToGroupRequest
{
    text:string;
    groupId?:string;
}
