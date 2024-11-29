import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignUpAuthComponent } from './sign-up-auth/sign-up-auth.component';
import { SignUpEndComponent } from './sign-up-end/sign-up-end.component';
import { LandingComponent } from './landing/landing.component';
import { GroupPageComponent } from './group-page/group-page.component';
import { GroupInfoComponent } from './group-info/group-info.component';
import { GroupChatComponent } from './group-chat/group-chat.component';
import { GroupEditComponent } from './group-edit/group-edit.component';
import { CreateGroupComponent } from './create-group/create-group.component';
import { AddGroupMemberComponent } from './add-group-member/add-group-member.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { CreateDetailEventComponent } from './create-detail-event/create-detail-event.component';


export const routes: Routes = [
  { path: '', redirectTo: 'sign-up', pathMatch: 'full' }, // Redirect to 'sign-up' on load
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'sign-up-auth', component: SignUpAuthComponent },
  { path: 'sign-up-end', component: SignUpEndComponent },
  { path: 'landing', component: LandingComponent },
  { path: 'group-page', component: GroupPageComponent },
  { path: 'group-info', component: GroupInfoComponent },
  { path: 'chat-group', component: GroupChatComponent },
  { path: 'group-edit', component: GroupEditComponent },
  { path: 'create-group', component: CreateGroupComponent },
  { path: 'add-member', component: AddGroupMemberComponent },
  { path: 'create-event', component: CreateEventComponent },
  { path: 'detail-event', component: CreateDetailEventComponent }
];
