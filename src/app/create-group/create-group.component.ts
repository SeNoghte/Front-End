import { Component } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-create-group',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './create-group.component.html',
  styleUrl: './create-group.component.scss'
})
export class CreateGroupComponent {
  selectedFile: File | null = null;
  imagePath = '';
  signUpForm = new FormGroup({});
  onSubmit() {
    console.log(this.signUpForm);
  }
  data = {
    image: "",
  }



  private profileApiUrl = 'https://api.becheen.ir:7001/api/User/Profile';

  constructor(
    private http: HttpClient,
    private Router: Router,
  ) { }

  redirectMemberList() {
    this.Router.navigate(['add-member']);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePath = reader.result as string;
      };
      reader.readAsDataURL(file);

      this.http.post(this.profileApiUrl, this.imagePath).subscribe((res) => {
        this.imagePath = "";
      })

    }
  }

}
