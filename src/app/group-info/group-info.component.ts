import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-group-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './group-info.component.html',
  styleUrls: ['./group-info.component.scss']
})
export class GroupInfoComponent {
  group = {
    name: 'اکیپ فوتبال دانشگاه',
    description: 'اینجا توضیحات اکیپ قرار می گیرد. اکیپ فوتبال دانشگاه علم و صنعت',
    creationDate: '۱۱ شهریور ۱۴۰۲',
    image: 'assets/game-cafe-logo.png',
    members: [
      { name: 'علی علوی', avatar: 'assets/member1.svg' },
      { name: 'محمد حسین', avatar: 'assets/member2.jpg' },
      { name: 'سپهر', avatar: 'assets/member3.jpg' }
    ]
  };
}
