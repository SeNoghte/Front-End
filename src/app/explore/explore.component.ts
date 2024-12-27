import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatRippleModule
  ],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.scss'
})
export class ExploreComponent {
  selectedChips: any[] = []; // Array to hold selected chips
  hideSingleSelectionIndicator = signal(true);

  constructor(private Router : Router){

  }

  chips = [
    { id: 1, label: 'کوهنوردی', isSelected: false },
    { id: 2, label: 'ورزشی', isSelected: false },
    { id: 3, label: 'هنر', isSelected: false },
    { id: 3, label: 'پخش فوتبال', isSelected: false },
    { id: 3, label: 'وای', isSelected: false },
  ];

  suggested_groups = [
    {name : 'علی علوی'},
    {name : 'محمدحسین'},
    {name : 'سپهر'},
  ]

  toggleSelection(chip: any): void {
    chip.isSelected = !chip.isSelected;

    if (chip.isSelected) {
      this.selectedChips.push(chip); 
    } else {
      this.selectedChips = this.selectedChips.filter(
        (selectedChip) => selectedChip !== chip
      ); 
    }

    console.log(this.selectedChips)
  }

  events = [
    {
      image: 'https://via.placeholder.com/100',
      profileImage: 'https://via.placeholder.com/40',
      name: 'محمد حسین',
      title: 'فتح قله دماوند',
      description:
        'برنامه صعود به دماوند یکی از بلندترین قله‌های ایران. سه روز هیجان و تجربه بی‌نظیر!',
      date: 'یکشنبه ۱۴۰۲/۰۹/۱۲ ساعت ۱۲:۳۰'
    },
    {
      image: 'https://via.placeholder.com/100',
      profileImage: 'https://via.placeholder.com/40',
      name: 'محمد حسین',
      title: 'کوهنوردی در البرز',
      description:
        'برنامه کوهنوردی یک‌روزه در طبیعت زیبای البرز. به همراه تیم حرفه‌ای.برنامه کوهنوردی یک‌روزه در طبیعت زیبای البرز. به همراه تیم حرفه‌ای.برنامه کوهنوردی یک‌روزه در طبیعت زیبای البرز. به همراه تیم حرفه‌ای.برنامه کوهنوردی یک‌روزه در طبیعت زیبای البرز. به همراه تیم حرفه‌ای.',
      date: 'پنجشنبه ۱۴۰۲/۰۹/۱۰ ساعت ۰۸:۰۰'
    }
  ];

  toggleSingleSelectionIndicator() {
    this.hideSingleSelectionIndicator.update(value => !value);
  }

  navigateToSearchExplore(){
    this.Router.navigate(['explore-search'])
  }
}
