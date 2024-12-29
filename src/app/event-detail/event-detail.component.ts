import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationVisibilityService } from '../services/navigation-visibility.service';
import { ToastrService } from 'ngx-toastr';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EventDetails, GetEventApiResponse, GetProfileApiResponse, User } from '../shared/models/group-model-type';
import { environment } from '../../environments/environment';
import { log } from 'node:console';
import { Location } from '@angular/common';

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
  profile!: User
  isPastEvent: boolean = false
  isUserInMembers : boolean = false

  constructor(
    private http: HttpClient,
    private router: Router,
    private navVisibilityService: NavigationVisibilityService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit() {
    this.navVisibilityService.hide()

    const GetProfileAPI = environment.apiUrl + '/User/Profile';

    this.http.post<GetProfileApiResponse>(GetProfileAPI, {}).subscribe(
      (res) => {
        console.log(res)
        this.profile = res.user as unknown as User
      },
      (err) => {
        this.toastr.error('خطا در ثبت!');
      }
    );

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

        const eventDateTime = new Date(`${this.event.date}T${this.event.time}`);
        const currentDateTime = new Date();

        this.isPastEvent = currentDateTime > eventDateTime;
      },
      (err) => {
        this.toastr.error('خطا در ثبت!');
      }
    );

    if (this.event.members!!.length > 0) {
      this.isUserInMembers = this.checkUserInEventMembers(this.event,  this.profile.username);
      console.log('is user in event members : ', this.isUserInMembers)
    }
  }

  checkUserInEventMembers(event: any, username: string): boolean {
    if (!event.members || event.members.length === 0) {
      return false; // No members in the event
    }
  
    return event.members.some((member: any) => member.username === username);
  }

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/default-route']);
    }
  }
}
