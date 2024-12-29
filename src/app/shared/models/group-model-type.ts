export interface User {
  userId: string;
  name: string;
  username: string;
  email: string;
  joinedDate: string;
  image?: string;
  aboutMe: string;
}

export interface Group {
  id: string;
  name: string;
  isPrivate: boolean;
  description: string;
  createdDate: string;
  image?: string;
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

export interface User {
  userId: string;
  name: string;
  username: string;
  email: string;
  joinedDate: string;
  image?: string;
  aboutMe: string;
}

export interface Member extends User {}

export interface Group {
  id: string;
  name: string;
  isPrivate: boolean;
  description: string;
  createdDate: string;
  image?: string;
  isAdmin: boolean;
  isMember: boolean;
  owner: User;
  members: Member[];
}

export interface ExploreGroupsApiResponse {
  success: boolean;
  message: string;
  errorCode: number;
  filteredGroups: Group[];
}

export interface SearchedEvents {
  id: string;
  title: string;
  description: string;
  ownerName: string;
  ownerImage?: string;
  date: string;
  time: string;
  imagePath?: string;
}

export interface GetPublicEventListSearchApiResponse {
  success: boolean;
  message: string;
  errorCode: number;
  items: SearchedEvents[];
}

export interface User {
  userId: string;
  name: string;
  username: string;
  email: string;
  joinedDate: string;
  image?: string;
  aboutMe: string;
}

export interface Member extends User {}

export interface EventDetails {
  id: string;
  title: string;
  description: string;
  owner?: User;
  date: string;
  time: string;
  groupId: string;
  imagePath?: string;
  isPrivate: boolean;
  members?: Member[];
}

export interface Task {
  id: string;
  title: string;
  assignedUserId: string;
  assignedUserName: string;
}

export interface Tag {
  id: string;
  tag: string;
}

export interface GetEventApiResponse {
  success: boolean;
  message: string;
  errorCode: number;
  event: Event;
  tasks: Task[];
  tags: Tag[];
}

export interface GetProfileApiResponse {
  success: boolean;
  message: string;
  errorCode: number;
  user: User;
  myGroups: Group[];
}

export interface TagsApiResponse {
  success: boolean;
  message: string;
  errorCode: number;
  tags: string[];
}

export interface GroupItem {
  name: string;
  id: string;
  description: string;
  image: string;
}

export interface GroupsApiResponse {
  success: boolean;
  message: string;
  errorCode: number;
  items: GroupItem[];
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  ownerName: string;
  ownerImage: string;
  date: string;
  time: string;
  imagePath: string;
}

export interface EventsApiResponse {
  success: boolean;
  message: string;
  errorCode: number;
  items: EventItem[];
}
