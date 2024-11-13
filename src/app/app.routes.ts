import { Routes } from '@angular/router';
import { GroupPageComponent } from './group-page/group-page.component';
import { GroupInfoComponent } from './group-info/group-info.component';

export const routes: Routes = [
  { path: '', redirectTo: '/group-page', pathMatch: 'full' },
  { path: 'group-page', component: GroupPageComponent },
  { path: 'group-info', component: GroupInfoComponent }
];
