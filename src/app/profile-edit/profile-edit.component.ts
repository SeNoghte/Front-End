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
  imageUrl: string = 'assets/icons/default-profile-image.svg';
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
          this.profileDescription = user.profileDescription || '';
          this.userId = user.userId;
          this.imageUrl = user.image || this.imageUrl;
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

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviewUrl = e.target.result;
      };
      reader.readAsDataURL(file);

      this.uploadProfileImage();
    }
  }

  uploadProfileImage(): void {
    if (!this.selectedImage) {
      alert('لطفاً یک تصویر انتخاب کنید.');
      return;
    }

    const formData = new FormData();
    formData.append('Image', this.selectedImage, this.selectedImage.name);
    formData.append('Type', this.selectedImage.type);

    const apiUrl = 'https://api.becheen.ir:6001/api/Image/Upload';

    this.http.post<{ success: boolean, imageUrl?: string }>(apiUrl, formData).subscribe(
      (response) => {
        if (response && response.success && response.imageUrl) {
          this.imageUrl = `${response.imageUrl}?t=${new Date().getTime()}`;
          this.imagePreviewUrl = null;
          alert('تصویر با موفقیت آپلود شد!');
        } else {
          alert('مشکلی در آپلود تصویر رخ داد.');
        }
      },
      (error) => {
        console.error('Error uploading profile image:', error);
        alert(`خطا در آپلود تصویر: ${error.status} - ${error.error?.message || error.statusText}`);
      }
    );
  }

  editImage(): void {
    const inputElement: HTMLInputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = 'image/*';
    inputElement.click();
    inputElement.addEventListener('change', (event: any) => this.onImageSelected(event));
  }
}
