import { routes } from './../app.routes';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'






@Component({
  selector: 'app-create-detail-event',
  standalone: true,
  imports: [MatSlideToggleModule, FormsModule, NgxMatTimepickerModule],
  templateUrl: './create-detail-event.component.html',
  styleUrl: './create-detail-event.component.scss'
})
export class CreateDetailEventComponent {
  showTimeField = false;
  // time = "";

  constructor(
    private Router: Router,) {

  }

  redirectMainEvent() {
    this.Router.navigate(['create-event']);
  }

  // CalculateTime(date: Date) {
  //   return this.datePipe.transform(date, 'HH:mm');

  // }
}

