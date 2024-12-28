import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-create-group',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, HttpClientModule, CommonModule],
  templateUrl: './create-group.component.html',
  styleUrl: './create-group.component.scss'
})
export class CreateGroupComponent {
  selectedFile: File | null = null;
  imagePath = '';
  groupId = '';
  newGroupInfo = new FormGroup({
    name: new FormControl<string>(''),
    description: new FormControl<string>(''),
    imageUrl: new FormControl<string>(''),
    membersToAdd: new FormControl([]),
  });

  data = {
    image: "",
  }

  constructor(
    private http: HttpClient,
    private Router: Router,
    private toastr: ToastrService,

  ) { }

  redirectMemberList() {
    this.Router.navigate(['add-member']);
  }

  onFileSelected(event: any): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {

      this.selectedFile = event.target.files[0] as File;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePath = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);

      const profileApiUrl = environment.apiUrl +'/Image/Upload';
      const formData = new FormData;
      if (this.selectedFile != null) {
        formData.append('Image', this.selectedFile);
      }
      formData.append('type', "group-photo");
      this.http.post<ApiResponse>(profileApiUrl, formData).subscribe(
        (response: ApiResponse) => {
          this.newGroupInfo.controls.imageUrl.setValue(response.imageId);
        },
        error => {
          this.toastr.error('خطا در ثبت اطلاعات!');
        }
      );
    }
  };

  nextStep() {
    const createApiUrl = environment.apiUrl +'/Group/Create';
    this.http.post<CreateApiResponse>(createApiUrl, this.newGroupInfo.value).subscribe(
      (response: CreateApiResponse) => {
        this.groupId = response.groupId;
        if (response.success) {
          this.Router.navigate(['add-member'],{ queryParams: { groupId: this.groupId} });
          this.toastr.success('گروه با موفقیت ایجاد شد.');
        }
      },
      error => {
        this.toastr.error('خطا در ثبت اطلاعات!');
      }
    );

  }

  redirectToGroupPage(){
    this.Router.navigate(['group-page']);
  }

}

interface ApiResponse {
  errorCode: number;
  imageId: string;
  message: string | null;
  success: boolean;
}

interface CreateApiResponse {

  "groupId": string,
  "success": boolean,
  "message": string,
  "errorCode": number
}



