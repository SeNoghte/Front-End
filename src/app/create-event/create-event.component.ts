import { Component } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { environment } from '../../environments/environment';
import { NgModule } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import moment from 'jalali-moment';
import { CommonModule } from "@angular/common";
import { MatDateFormats } from '@angular/material/core';
import { MaterialJalaliMomentAdapterModule } from 'material-jalali-moment-adapter';
import { JalaliMomentDateAdapter } from 'material-jalali-moment-adapter';
import { JalaliDateAdapter } from './jalali-date-adapter';



export const JALALI_MOMENT_FORMATS: MatDateFormats = {
  parse: {
    dateInput: "jYYYY-jMM-jDD"
  },
  display: {
    dateInput: "jYYYY-jMM-jDD",
    monthYearLabel: "jYYYY jMMMM",
    dateA11yLabel: "jYYYY-jMM-jDD",
    monthYearA11yLabel: "jYYYY jMMMM"
  }
};

export const MOMENT_FORMATS: MatDateFormats = {
  parse: {
    dateInput: "l"
  },
  display: {
    dateInput: "l",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY"
  }
};

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [CommonModule, FormsModule,MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatDatepickerModule, MatNativeDateModule, HttpClientModule, MatMomentDateModule, MatDatepickerModule, MatNativeDateModule,],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.scss',
  providers: [
    { provide: DateAdapter, useClass: JalaliDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: JALALI_MOMENT_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'fa-IR' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: false } },
  ],
})

export class CreateEventComponent {
  selectedDate: Date | null = null;
  selectedFile: File | null = null;
  imagePath = '';
  date = "";
  groupId: string = '';
  isGroupPrivate: boolean = false;

  createEventForm = new FormGroup({
    title: new FormControl<string>(''),
    description: new FormControl<string>(''),
    date: new FormControl<string>(''),
    groupId: new FormControl<string>(''),
    imagePath: new FormControl<string>(''),
  });

  constructor(
    private http: HttpClient,
    private Router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,

  ) { }

  ngOnInit() {
    moment.locale('fa');
    this.route.queryParams
      .subscribe(params => {
        this.groupId = params['id'];
        this.isGroupPrivate = params['isPrivate']
      }
      );
    this.createEventForm.controls.groupId.setValue(this.groupId);

    console.log(' is group private ?   : ' , this.isGroupPrivate)
  }

  redirectDetailEvent() {
    const formData = this.createEventForm.value;
    this.createEventForm.controls.date.setValue(this.datePipe.transform(this.createEventForm.controls.date.value, 'yyyy-MM-dd')?.toString() ?? '');
    console.log(formData);
    this.Router.navigate(['/event-detail'],
      {
        queryParams: {
          title: this.createEventForm.value.title,
          description: this.createEventForm.value.description,
          date: this.createEventForm.value.date,
          groupId: this.createEventForm.value.groupId,
          imagePath: this.createEventForm.value.imagePath,
          isPrivate:this.isGroupPrivate
        }
      }
    );

    // this.Router.navigate(['event-detail', {
    //   queryParams: formData,
    // }]);
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

      const profileApiUrl = environment.apiUrl + '/Image/Upload';
      const formData = new FormData;
      if (this.selectedFile != null) {
        formData.append('Image', this.selectedFile);
      }
      formData.append('type', "event-photo");
      this.http.post<ApiResponse>(profileApiUrl, formData).subscribe(
        (response: ApiResponse) => {
          this.createEventForm.controls.imagePath.setValue(response.imageId);
        },
        error => {
          this.toastr.error('خطا در ثبت اطلاعات!');
        }
      );
    }
  }

  onSubmit() {
    if (this.createEventForm.controls.date) {
      this.createEventForm.controls.date.setValue(this.datePipe.transform(this.createEventForm.controls.date.value, 'yyyy-MM-dd')?.toString() ?? '');
    }

    console.log(this.createEventForm.value)
    const createEventApiUrl = environment.apiUrl + '/Event/Create';
    this.http.post<CreateEventApiResponse>(createEventApiUrl, this.createEventForm.value).subscribe(
      (res: any) => {
        if (res.success) {
          console.log(res);
          this.toastr.success('رویداد با موفقیت ایجاد شد.');
        }
        else {
          console.log(res)
          this.toastr.error('خطا در ثبت!');
        }
      },
      (err) => {
        this.toastr.error('خطا در ثبت!');
      }
    );
  }

  redirectToChatGroup() {
    this.Router.navigate(['/chat-group', this.groupId]);
  }

}

interface ApiResponse {
  errorCode: number;
  imageId: string;
  message: string | null;
  success: boolean;
}

interface CreateEventApiResponse {
  success: boolean,
  message: string,
  errorCode: number,
  eventId: string
}





