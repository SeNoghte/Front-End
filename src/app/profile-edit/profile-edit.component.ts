import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';

interface ApiResponse {
  success: boolean;
  message: string | null;
  errorCode: number;
  imageId?: string;
}

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
  uploadedImageId: string | null = null;
  isUploading: boolean = false;

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.fetchUserProfile();
  }


  fetchUserProfile(): void {
    const apiUrl = `${environment.apiUrl}/User/Profile`;
    this.http.post<any>(apiUrl, {})
      .subscribe(
        (response) => {
          if (response.success && response.user) {
            const user = response.user;
            this.fullName = user.name;
            this.userName = user.username;
            this.email = user.email;
            this.profileDescription = user.aboutMe || '';
            this.userId = user.userId;
            this.imageUrl = user.image || this.imageUrl;
          } else {
            this.toastr.error('عدم موفقیت در دریافت اطلاعات کاربر.', 'خطا');
          }
        },
        (error) => {
          console.error('خطا در دریافت اطلاعات کاربر:', error);
          this.toastr.error('خطا در دریافت اطلاعات کاربر. لطفاً بعداً تلاش کنید.', 'خطا');
        }
      );
  }


  onImageSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        this.toastr.error('حجم تصویر بیش از حد بزرگ است. لطفاً تصویری با حجم کمتر انتخاب کنید.', 'خطا');
        return;
      }

      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        this.toastr.error('فرمت تصویر نامعتبر است. لطفاً یکی از فرمت‌های PNG, JPEG, JPG, GIF را انتخاب کنید.', 'خطا');
        return;
      }

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
      this.toastr.warning('لطفاً یک تصویر انتخاب کنید.', 'هشدار');
      return;
    }

    this.isUploading = true;

    const formData = new FormData();
    formData.append('Image', this.selectedImage, this.selectedImage.name);
    formData.append('type', 'profile-photo');

    const apiUrl = `${environment.apiUrl}/Image/Upload`;

    this.http.post<ApiResponse>(apiUrl, formData)
      .subscribe(
        (response) => {
          this.isUploading = false;
          if (response && response.success && response.imageId) {
            this.uploadedImageId = response.imageId;
            this.imageUrl = response.imageId;
            this.imagePreviewUrl = null;
            this.toastr.success('تصویر با موفقیت بارگذاری شد!', 'عملیات موفق');
          } else {
            this.toastr.error(response.message || 'خطا در بارگذاری تصویر.', 'عملیات ناموفق');
          }
        },
        (error: HttpErrorResponse) => {
          this.isUploading = false;
          console.error('خطا در آپلود تصویر پروفایل:', error);
          if (error.error && error.error.errors) {
            const validationErrors = error.error.errors;
            for (const key in validationErrors) {
              if (validationErrors.hasOwnProperty(key)) {
                const messages = validationErrors[key];
                messages.forEach((msg: string) => {
                  this.toastr.error(msg, 'خطا');
                });
              }
            }
          } else if (error.error instanceof ErrorEvent) {
            this.toastr.error(`خطا در آپلود تصویر: ${error.error.message}`, 'خطا');
          } else {
            this.toastr.error(
              `خطا در آپلود تصویر: ${error.status} - ${error.error?.message || error.message}`,
              'خطا'
            );
          }
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


  saveChanges(): void {
    const apiUrl = `${environment.apiUrl}/User/EditProfile`;

    const requestBody: any = {
      name: this.fullName,
      username: this.userName,
      image: this.uploadedImageId ? this.uploadedImageId : this.imageUrl,
      aboutMe: this.profileDescription,
    };

    this.http.post<any>(apiUrl, requestBody)
      .subscribe(
        (response) => {
          if (response.success) {
            this.toastr.success('پروفایل با موفقیت به‌روزرسانی شد!', 'عملیات موفق');
            this.fetchUserProfile();
          } else {
            this.toastr.error(response.message || 'خطا در به‌روزرسانی پروفایل.', 'عملیات ناموفق');
          }
        },
        (error: HttpErrorResponse) => {
          console.error('خطا در ذخیره تغییرات:', error);
          this.toastr.error('خطا در ذخیره تغییرات. لطفاً دوباره تلاش کنید.', 'خطا');
        }
      );
  }

  updateOtherPages(user: any): void {
  }

  logout(): void {
    localStorage.clear();
    sessionStorage.clear();

    this.toastr.success('با موفقیت از حساب کاربری خارج شدید.', 'عملیات موفق');


    window.location.href = '/login';
  }

}
