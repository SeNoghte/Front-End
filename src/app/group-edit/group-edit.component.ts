import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';


interface ApiResponse {
  success: boolean;
  message: string | null;
  imageId?: string;
}

@Component({
  selector: 'app-group-edit',
  templateUrl: './group-edit.component.html',
  styleUrls: ['./group-edit.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
    HttpClientModule
  ],
})
export class GroupEditComponent implements OnInit {
  groupId: string|null = '';
  groupName: string = '';
  groupDescription: string = '';
  groupImageUrl: string = 'assets/icons/default-profile-image.svg';
  selectedImage: File | null = null;
  imagePreviewUrl: string | null = null;
  uploadedImageId: string | null = null;
  isUploading: boolean = false;
  isAdmin: boolean = true;


  constructor(public router: Router, private http: HttpClient, private toastr: ToastrService, private route: ActivatedRoute) { }


  ngOnInit(): void {
    this.fetchGroupDetails();
  }

  fetchGroupDetails(): void {
    this.groupId = this.route.snapshot.paramMap.get('id');
    if (!this.groupId) {
      this.toastr.error('Group ID is not provided in the route.', 'Error');
      return;
    }
    const apiUrl = `${environment.apiUrl}/Group/GetGroup`;
    const requestBody = { groupId: this.groupId };

    console.log('Fetching group details with:', requestBody);

    this.http.post<any>(apiUrl, requestBody).subscribe(
      (response) => {
        if (response.success) {
          const group = response.group;


          this.groupName = group.name;
          this.groupDescription = group.description;
          this.groupImageUrl = group.image || this.groupImageUrl;
          this.isAdmin = group.isAdmin;

          console.log('Group details fetched successfully:', group);
        } else {
          console.error('API Response Error:', response);
          this.toastr.error(response.message || 'خطا در دریافت اطلاعات گروه.', 'خطا');
        }
      },
      (error: HttpErrorResponse) => {
        console.error('HTTP Error:', error);
        this.toastr.error('خطا در دریافت اطلاعات گروه.', 'خطا');
      }
    );
  }


  onImageSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        this.toastr.error('حجم تصویر بیش از حد بزرگ است.', 'خطا');
        return;
      }

      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        this.toastr.error('فرمت تصویر نامعتبر است.', 'خطا');
        return;
      }

      this.selectedImage = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviewUrl = e.target.result;
      };
      reader.readAsDataURL(file);

      this.uploadGroupImage();
    }
  }

  uploadGroupImage(): void {
    if (!this.selectedImage) {
      this.toastr.warning('لطفاً یک تصویر انتخاب کنید.', 'هشدار');
      return;
    }

    this.isUploading = true;

    const formData = new FormData();
    formData.append('Image', this.selectedImage, this.selectedImage.name);

    // const apiUrl = `${environment.apiUrl}/Image/Upload${this.groupId}`;
    const apiUrl = `${environment.apiUrl}/Image/Upload`;

    this.http.post<ApiResponse>(apiUrl, formData).subscribe(
      (response) => {
        this.isUploading = false;
        if (response.success && response.imageId) {
          this.uploadedImageId = response.imageId;
          this.groupImageUrl = response.imageId;
          this.imagePreviewUrl = null;
          this.toastr.success('تصویر با موفقیت بارگذاری شد!', 'عملیات موفق');
        } else {
          this.toastr.error(response.message || 'خطا در بارگذاری تصویر.', 'عملیات ناموفق');
        }
      },
      (error: HttpErrorResponse) => {
        this.isUploading = false;
        console.error('خطا در آپلود تصویر گروه:', error);
        this.toastr.error('خطا در آپلود تصویر گروه.', 'خطا');
      }
    );
  }

  saveChanges(): void {
    const apiUrl = `${environment.apiUrl}/Group/EditGroup`;

    const requestBody: any = {
      groupId: this.groupId,
      name: this.groupName,
      description: this.groupDescription,
      image: this.uploadedImageId || this.groupImageUrl,
    };

    console.log('Request Body:', requestBody);

    this.http.post<any>(apiUrl, requestBody).subscribe(
      (response) => {
        if (response.success) {
          this.toastr.success('گروه با موفقیت به‌روزرسانی شد!', 'عملیات موفق');
          // this.router.navigate(['/group-info']);
          this.fetchGroupDetails();
        } else {
          this.toastr.error(response.message || 'خطا در به‌روزرسانی گروه.', 'عملیات ناموفق');
        }
      },
      (error: HttpErrorResponse) => {
        console.error('خطا در ذخیره تغییرات:', error);
        this.toastr.error('خطا در ذخیره تغییرات. لطفاً دوباره تلاش کنید.', 'خطا');
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

  navigateBack(): void {
    const groupId = this.route.snapshot.paramMap.get('id');
    this.router.navigate(['/group-info',groupId]);
  }

  deleteGroup(): void {
    const apiUrl = `${environment.apiUrl}/Group/Delete/${this.groupId}`;
    this.http.delete<any>(apiUrl).subscribe(
      (response) => {
        if (response.success) {
          this.toastr.success('گروه با موفقیت حذف شد!', 'عملیات موفق');
          this.router.navigate(['/']);
        } else {
          this.toastr.error(response.message || 'خطا در حذف گروه.', 'خطا');
        }
      },
      (error: HttpErrorResponse) => {
        console.error('خطا در حذف گروه:', error);
        this.toastr.error('خطا در حذف گروه.', 'خطا');
      }
    );
  }
}

