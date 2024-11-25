import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';



@Component({
  selector: 'app-search-add-member',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-group-member.component.html',
  styleUrl: './add-group-member.component.scss'
})
export class AddGroupMemberComponent {
  private searchSubject: Subject<string> = new Subject<string>();
  searchTerm: string = '';

  constructor(
    private Router: Router,
  ) { }

  redirectCreateGroup() {
    this.Router.navigate(['create-group']);
  }
  onSearch() {
    this.searchSubject.next(this.searchTerm);
  }
}
