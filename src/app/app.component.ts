import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GroupChatComponent } from './group-chat/group-chat.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,GroupChatComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Front-End';

}
