import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationVisibilityService } from '../services/navigation-visibility.service';
import { ToastrService } from 'ngx-toastr';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EventDetails, GetEventApiResponse } from '../shared/models/group-model-type';
import { environment } from '../../environments/environment';
import { log } from 'node:console';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [
    HttpClientModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.scss'
})
export class EventDetailComponent {
  eventId !: number
  event!: EventDetails

  constructor(
    private http: HttpClient,
    private router: Router,
    private navVisibilityService: NavigationVisibilityService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.navVisibilityService.hide()

    this.route.queryParams.subscribe((params) => {
      this.eventId = params['id'];
      console.log('Event ID:', this.eventId);
    });


    const GetEventAPI = environment.apiUrl + '/Event/GetEvent';

    const requestBody = {
      eventId: this.eventId,
    };

    this.http.post<GetEventApiResponse>(GetEventAPI, requestBody).subscribe(
      (res) => {
        this.event = res.event as unknown as EventDetails;
        console.log(this.event)
      },
      (err) => {
        this.toastr.error('خطا در ثبت!');
      }
    );
  }
}
