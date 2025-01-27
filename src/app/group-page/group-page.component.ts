import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';

interface UserProfileResponse {
  success: boolean;
  message: string;
  errorCode: number;
  user: User;
  myGroups: Group[];
}

interface User {
  userId: string;
  name: string;
  username: string;
  email: string;
  joinedDate: string;
  image: string;
  aboutMe: string;
}

interface Group {
  id: string;
  name: string;
  image: string | null;
  avatarLetter: string;
  avatarColor: string;
  isPrivate: boolean;
  isAdmin: boolean;
  isMember: boolean;
}

@Component({
  selector: 'app-group-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    MatButtonModule,
    RouterModule,
  ],
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

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(300))
      .subscribe((searchTerm) => {
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

  redirectToCreateGroup() {
    this.router.navigate(['create-group']);
  }

  onSearch() {
    this.searchSubject.next(this.searchTerm);
  }

  performSearch(term: string): void {
    const trimmedTerm = term.trim().toLowerCase();

    if (trimmedTerm === '') {
      this.searchResults = this.groups;
    } else {
      this.searchResults = this.groups.filter((group) =>
        group.name.toLowerCase().includes(trimmedTerm)
      );
    }
  }

  fetchGroups(): void {
    const apiUrl = environment.apiUrl + '/User/Profile';
    const requestBody = {

    };

    this.http.post<UserProfileResponse>(apiUrl, requestBody).subscribe(
      (response) => {
        if (response.success && response.myGroups) {

          this.groups = response.myGroups.map((group: any): Group => {
            const { letter, color } = this.generateAvatar(group.name);
            return {
              id: group.id,
              name: group.name,
              image: group.image || null,
              avatarLetter: letter,
              avatarColor: color,
              isPrivate: group.isPrivate || false,
              isAdmin: group.isAdmin || false,
              isMember: group.isMember || false,
            };
          });

          this.searchResults = this.groups;
        } else {
          console.error('No groups found or API response invalid');
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
      '#F44336',
      '#E91E63',
      '#9C27B0',
      '#673AB7',
      '#3F51B5',
      '#2196F3',
      '#03A9F4',
      '#00BCD4',
      '#009688',
      '#4CAF50',
      '#8BC34A',
      '#CDDC39',
      '#FFEB3B',
      '#FFC107',
      '#FF9800',
      '#FF5722',
    ];

    const letter = name.charAt(0).toUpperCase();
    const color = colors[name.charCodeAt(0) % colors.length];
    return { letter, color };
  }

  navigateToGroupChat(groupId: string): void {
    this.router.navigate(['/chat-group', groupId]);
  }

  trackByGroupId(index: number, group: Group): string {
    return group.id;
  }
}
