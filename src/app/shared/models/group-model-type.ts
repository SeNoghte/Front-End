export interface User {
    userId: string;
    name: string;
    username: string;
    email: string;
    joinedDate: string;
    image: string;
    aboutMe: string;
}

export interface Group {
    id: string;
    name: string;
    isPrivate: boolean;
    description: string;
    createdDate: string;
    image: string;
    isAdmin: boolean;
    isMember: boolean;
    owner: User;
    members: User[];
}

export interface GroupEvent {
    id: string;
    title: string;
    description: string;
    owner: User;
    date: string;
    time: string;
    groupId: string;
    imagePath: string;
    isPrivate: boolean;
    members: User[];
}

export interface ApiResponse {
    success: boolean;
    message: string;
    errorCode: number;
    group: Group;
    events: Event[];
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
    isMe?: boolean;
}

export interface SendMessageToGroupRequest {
    text: string;
    groupId?: string;
}
