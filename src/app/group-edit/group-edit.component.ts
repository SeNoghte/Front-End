import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { NavigationVisibilityService } from '../services/navigation-visibility.service';

@Component({
  selector: 'app-group-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, RouterModule],
  templateUrl: './group-edit.component.html',
  styleUrls: ['./group-edit.component.scss']
})
export class GroupEditComponent {
  groupName: string = '';
  groupDescription: string = '';

  constructor(
    private navVisibilityService: NavigationVisibilityService,
  ) {
  }
  ngOnInit() : void {
    this.navVisibilityService.hide()
  }

  goBack() {

    console.log("Navigating back");
  }

  saveChanges() {

    console.log("Changes saved");
  }

  editImage() {

    console.log("Editing image");
  }

  deleteGroup() {

    console.log("Group deleted");
  }
}
