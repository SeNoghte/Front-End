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
import { RecoveryPassEmailComponent } from './recovery-pass-email/recovery-pass-email.component';
import { RecoveryPassCodeComponent } from './recovery-pass-code/recovery-pass-code.component';
import { RecoveryPassNewPassComponent } from './recovery-pass-new-pass/recovery-pass-new-pass.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { CreateGroupComponent } from './create-group/create-group.component';
import { AddGroupMemberComponent } from './add-group-member/add-group-member.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { CreateDetailEventComponent } from './create-detail-event/create-detail-event.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { ExploreComponent } from './explore/explore.component';
import { ExploreSearchComponent } from './explore-search/explore-search.component';

export const routes: Routes = [
  { path: '', redirectTo: 'sign-up', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'sign-up-auth', component: SignUpAuthComponent },
  { path: 'sign-up-end', component: SignUpEndComponent },
  { path: 'landing', component: LandingComponent },
  { path: 'group-page', component: GroupPageComponent },
  { path: 'group-info', component: GroupInfoComponent },
  { path: 'group-info/:id', component: GroupInfoComponent },
  { path: 'chat-group', component: GroupChatComponent },
  { path: 'chat-group/:id', component: GroupChatComponent },
  { path: 'group-edit', component: GroupEditComponent },
  { path: 'group-edit/:id', component: GroupEditComponent },
  { path: 'recovery-pass-email', component: RecoveryPassEmailComponent },
  { path: 'recovery-pass-code', component: RecoveryPassCodeComponent },
  { path: 'recovery-pass-new-pass', component: RecoveryPassNewPassComponent },
  { path: 'profile', component: ProfileComponent},
  { path: 'profile/:id', component: ProfileComponent },
  { path: 'profile-edit', component: ProfileEditComponent},
  { path: 'create-group', component: CreateGroupComponent },
  { path: 'add-member',  component: AddGroupMemberComponent},
  { path: 'create-event', component: CreateEventComponent},
  { path: 'event-detail', component: CreateDetailEventComponent},
  { path: 'show-event-detail', component: EventDetailComponent },
  { path: 'explore', component: ExploreComponent },
  { path: 'explore-search', component: ExploreSearchComponent },
];
