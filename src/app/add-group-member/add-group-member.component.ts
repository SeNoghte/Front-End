import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule,FormGroup,FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NewGroupInfoService } from '../services/new-group-info.service';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-search-add-member',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule,HttpClientModule,MatCheckboxModule],
  templateUrl: './add-group-member.component.html',
  styleUrl: './add-group-member.component.scss'
})
export class AddGroupMemberComponent {
  private searchSubject: Subject<string> = new Subject<string>();
  searchTerm: string = '';
  usersList: any[] = [];
  groupId: string = '';
  newGroupInfo = new FormGroup({
    groupId: new FormControl<string>(''),
    usersToAdd: new FormControl<any[]>([]),
  });

  constructor(
    private http: HttpClient,
    private Router: Router,
    private newGroupInfoService: NewGroupInfoService,
    private route: ActivatedRoute
  ) { 
    this.usersList = this.usersList.map(user => ({
      ...user,
      isChecked: false,
    }));
  }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        console.log(params); // { order: "popular" }

        this.groupId = params['groupId'];

        console.log(this.groupId); // popular
      }
    );
    this.newGroupInfo.controls.groupId.setValue(this.groupId);

  }

  redirectCreateGroup() {
    this.Router.navigate(['create-group']);
  }
  onSearch() {
    console.log(this.searchTerm);
    this.searchSubject.next(this.searchTerm);
    const getUsersApiUrl = 'https://api.becheen.ir:7001/api/User/GetUsers';
    const payload = {
      filter: this.searchTerm,
      pageIndex: 10,
      pageSize: 10000,
    };

    this.http.post(getUsersApiUrl, payload ).subscribe(
      (res: any) => {
        console.log('Upload successful', res);
        this.usersList = res.filteredUsers;
        
      },
      (err) => {
        console.error('Upload failed', err);
      }
    );
  }

  onSubmit() {
    const selectedUsers = this.usersList.filter(user => user.isChecked);
    const addMemberApiUrl = 'https://api.becheen.ir:7001/api/Group/AddMember';
    this.newGroupInfo.controls.usersToAdd.setValue(selectedUsers.map((item)=>item.userId));
    this.http.post(addMemberApiUrl, this.newGroupInfo.value ).subscribe(
      (res: any) => {
        console.log('Upload successful', res);
        // this.usersList = res.filteredUsers;
        
      },
      (err) => {
        console.error('Upload failed', err);
      }
    );
    console.log(selectedUsers);
  }
}
