import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';


interface Group {
  name: string;
  image: string | null;
  avatarLetter: string;
  avatarColor: string;
}

@Component({
  selector: 'app-group-page',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, HttpClientModule],
  templateUrl: './group-page.component.html',
  styleUrls: ['./group-page.component.scss'],
})
export class GroupPageComponent implements OnInit, OnDestroy {
  searchMode = false;
  searchTerm: string = '';

  private searchSubject: Subject<string> = new Subject<string>();
  private searchSubscription!: Subscription;

  groups: Group[] = [];
  searchResults: Group[] = [];


  constructor(private http: HttpClient, private toastr: ToastrService) { }

  ngOnInit() {
    this.searchSubscription = this.searchSubject.pipe(debounceTime(300)).subscribe((searchTerm) => {
      this.performSearch(searchTerm);
    });

    this.fetchGroups();
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  toggleSearch() {
    this.searchMode = !this.searchMode;
    if (this.searchMode) {
      this.searchResults = [];
      this.searchTerm = '';
    }
  }


  toggleEdit() {

  }

  onSearch() {
    this.searchSubject.next(this.searchTerm);
  }

  performSearch(term: string): void {
    const trimmedTerm = term.trim().toLowerCase();

    if (trimmedTerm === '') {
      this.searchResults = [];
    } else {
      this.searchResults = this.groups.filter((group) =>
        group.name.toLowerCase().includes(trimmedTerm)
      );
    }
  }



  fetchGroups(): void {
    const apiUrl = 'https://api.becheen.ir:6001/api/Group/GetGroups';
    const requestBody = {
      filter: '',
      pageIndex: 1,
      pageSize: 100,
    };

    this.http.post<any>(apiUrl, requestBody).subscribe(
      (response) => {
        console.log('API Response:', response);
        if (response.success && response.filteredGroups) {
          this.groups = response.filteredGroups.map((group: any): Group => {
            const { letter, color } = this.generateAvatar(group.name);
            return {
              name: group.name,
              image: group.image || null,
              avatarLetter: letter,
              avatarColor: color,
            };
          });
          this.searchResults = this.groups;
        } else {
          this.groups = [];
          this.searchResults = [];
        }
      },
      (error) => {
        this.toastr.error('ارتباط با سرور برقرار نشد', 'خطا در دریافت گروه‌ها');
        console.error('API request failed:', error);
      }
    );
  }

  generateAvatar(name: string): { letter: string; color: string } {
    const colors = [
      '#F44336', '#E91E63', '#9C27B0', '#673AB7',
      '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',
      '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
      '#FFEB3B', '#FFC107', '#FF9800', '#FF5722',
    ];

    const letter = name.charAt(0).toUpperCase();
    const color = colors[name.charCodeAt(0) % colors.length];
    return { letter, color };
  }
}
