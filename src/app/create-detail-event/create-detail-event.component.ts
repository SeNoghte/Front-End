import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { routes } from './../app.routes';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';

@Component({
  selector: 'app-create-detail-event',
  standalone: true,
  imports: [MatSlideToggleModule, FormsModule, NgxMatTimepickerModule],
  templateUrl: './create-detail-event.component.html',
  styleUrl: './create-detail-event.component.scss'
})
export class CreateDetailEventComponent {
  showTimeField = false;
  
  constructor(
    private Router: Router,) {

  }

  redirectMainEvent() {
    this.Router.navigate(['create-event']);
  }

}

