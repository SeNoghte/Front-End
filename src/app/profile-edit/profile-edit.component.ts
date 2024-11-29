import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    HttpClientModule,
  ],
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {
  fullName: string = '';
  userName: string = '';
  email: string = '';
  profileDescription: string = '';
  userId: string = '';
  imageUrl: string = '';
  selectedImage: File | null = null;
  imagePreviewUrl: string | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchUserProfile();
  }


  fetchUserProfile(): void {
    const apiUrl = 'https://api.becheen.ir:6001/api/User/Profile';

    this.http.post<any>(apiUrl, {}).subscribe(
      (response) => {
        if (response.success) {

          const user = response.user;
          this.fullName = user.name;
          this.userName = user.username;
          this.email = user.email;
          this.profileDescription = user.profileDescription;
          this.userId = user.userId;
          this.imageUrl = user.image;
          this.imageUrl = user.image || 'assets/icons/default-profile-image.svg';
        } else {
          alert('Failed to fetch user data.');
        }
      },
      (error) => {
        console.error('Error fetching user data:', error);
        alert('Error fetching user data. Please try again later.');
      }
    );
  }


  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      this.previewImage(file);
    }
  }


  previewImage(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreviewUrl = e.target.result;
    };
    reader.readAsDataURL(file);
  }


  editImage(): void {
    const inputElement: HTMLInputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = 'image/*';
    inputElement.click();
    inputElement.addEventListener('change', (event: any) => this.onImageSelected(event));
  }


  saveChanges(): void {
    if (!this.fullName || !this.userName || !this.profileDescription) {
      alert('لطفاً همه فیلدها را پر کنید.');
      return;
    }

    const formData = new FormData();
    formData.append('userId', this.userId);
    formData.append('fullName', this.fullName);
    formData.append('userName', this.userName);
    formData.append('email', this.email);
    formData.append('profileDescription', this.profileDescription);

    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    const apiUrl = 'https://api.becheen.ir:6001/api/User/Profile';
    const headers = new HttpHeaders({

    });

    this.http.post<any>(apiUrl, formData, { headers }).subscribe(
      (response) => {
        if (response.success) {
          alert('تغییرات با موفقیت ذخیره شد!');
          this.fetchUserProfile();
        } else {
          alert('مشکلی پیش آمده، لطفاً دوباره تلاش کنید.');
        }
      },
      (error) => {
        console.error('Error saving user data:', error);
        alert(`خطا در ذخیره تغییرات: ${error.status} - ${error.statusText}`);
        if (error.status === 404) {
          console.error('Endpoint not found. Please check the API URL and method.');
        } else {
          console.error('Server error:', error.message);
        }
      }
    );
  }


  deleteAccount(): void {
    const confirmDelete = confirm('آیا مطمئن هستید که می‌خواهید حساب خود را حذف کنید؟');
    if (confirmDelete) {
      console.log('حساب کاربری حذف شد');
      alert('حساب کاربری شما حذف شد.');
    }
  }
}
