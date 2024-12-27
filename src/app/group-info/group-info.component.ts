import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NavigationVisibilityService } from '../services/navigation-visibility.service';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../../environments/environment';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Member {
  userId: string;
  name: string;
  username: string;
  email: string;
  joinedDate: string;
  image: string;
  aboutMe: string;
}

interface Owner extends Member { }

interface Group {
  id: string;
  name: string;
  isPrivate: boolean;
  description: string;
  createdDate: string;
  owner: Owner;
  members: Member[];
  imageUrl: string;
}

@Component({
  selector: 'app-group-info',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    HttpClientModule, 
    FormsModule
  ],
  templateUrl: './group-info.component.html',
  styleUrls: ['./group-info.component.scss'],
})
export class GroupInfoComponent implements OnInit {
  group: Group | null = null;
  newMemberEmail: string = '';
  addMemberMessage: string = '';
  isAddMemberModalVisible: boolean = false;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private navVisibilityService: NavigationVisibilityService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.navVisibilityService.hide();
    this.fetchGroupInfo();
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

  fetchGroupInfo(): void {
    const groupId = this.route.snapshot.paramMap.get('id');
    if (!groupId) {
      console.error('Group ID not provided in the route.');
      return;
    }

    const apiUrl = `${environment.apiUrl}/Group/GetGroup`;
    const requestBody = { groupId };

    this.http.post<any>(apiUrl, requestBody).subscribe(
      (response) => {
        if (response.success) {
          this.group = {
            id: response.group.id,
            name: response.group.name,
            isPrivate: response.group.isPrivate,
            description: response.group.description,
            createdDate: new Date(response.group.createdDate).toLocaleDateString('fa-IR'),
            owner: response.group.owner,
            members: response.group.members || [],
            imageUrl: response.group.image || null,
          };
        } else {
          console.error('Failed to fetch group info:', response.message);
        }
      },
      (error) => {
        console.error('Error fetching group info:', error);
      }
    );
  }

  toggleAddMemberModal(): void {
    this.isAddMemberModalVisible = !this.isAddMemberModalVisible;
    if (!this.isAddMemberModalVisible) {
      this.addMemberMessage = '';
    }
  }

  addMember(): void {
    if (!this.newMemberEmail.trim()) {
      this.addMemberMessage = 'لطفاً ایمیل یا شناسه عضو را وارد کنید.';
      return;
    }

    if (!this.group) {
      this.addMemberMessage = 'گروه بارگذاری نشده است.';
      return;
    }

    const apiUrl = `${environment.apiUrl}/Group/AddMember`;
    const requestBody = {
      groupId: this.group.id,
      usersToAdd: [this.newMemberEmail],
    };

    this.http.post<any>(apiUrl, requestBody).subscribe(
      (response) => {
        if (response.success) {
          this.addMemberMessage = 'عضو با موفقیت اضافه شد!';
          this.newMemberEmail = '';
          this.fetchGroupInfo();
        } else {
          this.addMemberMessage = `خطا: ${response.message}`;
        }
      },
      (error) => {
        this.addMemberMessage = 'خطا در برقراری ارتباط با سرور.';
        console.error('Error adding member:', error);
      }
    );
  }
  goBack(): void {
    this.location.back();
  }

  editGroup(): void {
    console.log('Edit button clicked');
  }
}
