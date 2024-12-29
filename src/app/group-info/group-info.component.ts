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
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
    FormsModule,
  ],
  templateUrl: './group-info.component.html',
  styleUrls: ['./group-info.component.scss'],
})
export class GroupInfoComponent implements OnInit {
  group: Group | null = null;
  newMemberEmail: string = '';
  addMemberMessage: string = '';
  isAddMemberModalVisible: boolean = false;
  isAdmin: boolean = false;
  isFollowing: boolean = false;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private navVisibilityService: NavigationVisibilityService,
    private location: Location,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.navVisibilityService.hide();
    this.fetchGroupInfo();
  }


  fetchGroupInfo(): void {
    const groupId = this.route.snapshot.paramMap.get('id');
    if (!groupId) {
      this.toastr.error('Group ID is not provided in the route.', 'Error');
      return;
    }

    const apiUrl = `${environment.apiUrl}/Group/GetGroup`;
    const requestBody = { groupId };

    this.http.post<any>(apiUrl, requestBody).subscribe(
      (response) => {
        if (response.success) {
          const groupData = response.group;

          this.group = {
            id: groupData.id,
            name: groupData.name,
            isPrivate: groupData.isPrivate,
            description: groupData.description,
            createdDate: new Date(groupData.createdDate).toLocaleDateString('fa-IR'),
            imageUrl: groupData.image || null,
            owner: groupData.owner,
            members: groupData.members || [],
          };

          this.isAdmin = groupData.isAdmin;
          this.isFollowing = groupData.isMember;

          console.log('Group Data:', this.group);
          console.log('Is Admin:', this.isAdmin);
          console.log('Is Following:', this.isFollowing);
        } else {
          this.toastr.error(response.message || 'Failed to fetch group info.', 'Error');
        }
      },
      (error) => {
        this.toastr.error('An error occurred while fetching group info.', 'Error');
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

  joinGroup(): void {
    if (!this.group) {
      this.toastr.error('اطلاعات گروه موجود نیست.', 'خطا');
      return;
    }

    const apiUrl = `${environment.apiUrl}/Group/Join`;
    const requestBody = { groupId: this.group.id };

    this.http.post<any>(apiUrl, requestBody).subscribe(
      (response) => {
        if (response.success) {
          this.isFollowing = true;
          this.fetchGroupInfo();
          this.toastr.success('شما با موفقیت به گروه پیوستید.', 'موفقیت');
        } else {
          this.toastr.error(response.message || 'پیوند به گروه انجام نشد.', 'خطا');
        }
      },
      (error) => {
        this.toastr.error('در پیوند به گروه مشکلی پیش آمد.', 'خطا');
        console.error('Error joining group:', error);
      }
    );
  }


  leaveGroup(): void {
    if (!this.group) {
      this.toastr.error('اطلاعات گروه موجود نیست.', 'خطا');
      return;
    }

    const apiUrl = `${environment.apiUrl}/Group/Leave`;
    const requestBody = { groupId: this.group.id };

    this.http.post<any>(apiUrl, requestBody).subscribe(
      (response) => {
        if (response.success) {
          this.isFollowing = false; // Update the state to reflect that the user is no longer following the group
          this.fetchGroupInfo(); // Refresh the group info
          this.toastr.success('شما با موفقیت از گروه خارج شدید.', 'موفقیت');
        } else {
          this.toastr.error(response.message || 'خروج از گروه انجام نشد.', 'خطا');
        }
      },
      (error) => {
        this.toastr.error('در خروج از گروه مشکلی پیش آمد.', 'خطا');
        console.error('Error leaving the group:', error);
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


  goBack(): void {
    this.location.back();
  }

  editGroup(): void {
    console.log('Edit button clicked');
  }

  redirectToChatGroup(){
    const groupId = this.route.snapshot.paramMap.get('id');
    this.router.navigate(['/chat-group', groupId]);
  }
}
