import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavigationVisibilityService } from '../services/navigation-visibility.service';

@Component({
  selector: 'app-group-info',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
      { name: 'علی علوی', avatar: 'assets/icons/member1.svg' },
      { name: 'محمد حسین', avatar: 'assets/icons/member2.svg' },
      { name: 'سپهر', avatar: 'assets/icons/member3.svg' }
    ]
  };

  constructor(
    private navVisibilityService: NavigationVisibilityService,
  ) {
  }
  ngOnInit() : void {
    this.navVisibilityService.hide()
  }

}
