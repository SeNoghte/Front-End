import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-group-page',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './group-page.component.html',
  styleUrls: ['./group-page.component.scss']
})
export class GroupPageComponent implements OnInit, OnDestroy {
  searchMode = false;
  searchTerm: string = '';

  private searchSubject: Subject<string> = new Subject<string>();
  private searchSubscription!: Subscription;

  groups = [
    { name: 'صخره نوردی ستاک', image: 'assets/icons/member1.svg' },
    { name: 'کافه بازی ونگ', image: 'assets/icons/member2.svg' },
    { name: 'فوتبال دانشکده کامپیوتر', image: 'assets/icons/member3.svg' },
  ];

  searchResults = this.groups;

  ngOnInit() {
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(300)
    ).subscribe(searchTerm => {
      this.performSearch(searchTerm);
    });
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  toggleSearch() {
    this.searchMode = !this.searchMode;
    if (this.searchMode) {
      this.searchResults = this.groups;
      this.searchTerm = '';
    }
  }

  toggleEdit() {

  }

  onSearch() {
    this.searchSubject.next(this.searchTerm);
  }

  performSearch(term: string) {
    const trimmedTerm = term.trim().toLowerCase();
    if (trimmedTerm === '') {
      this.searchResults = this.groups;
    } else {
      this.searchResults = this.groups.filter(group =>
        group.name.toLowerCase().includes(trimmedTerm)
      );
    }
  }
}
