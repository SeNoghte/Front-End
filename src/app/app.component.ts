import { Component } from '@angular/core';
import { GroupPageComponent } from './group-page/group-page.component';
import { GroupInfoComponent } from './group-info/group-info.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, GroupPageComponent, GroupInfoComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent { }
