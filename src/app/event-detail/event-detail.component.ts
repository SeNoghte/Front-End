import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationVisibilityService } from '../services/navigation-visibility.service';
import { ToastrService } from 'ngx-toastr';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EventDetails, GetEventApiResponse, GetProfileApiResponse, JoinEventRequest, JoinEventResponse, User } from '../shared/models/group-model-type';
import { environment } from '../../environments/environment';
import { log } from 'node:console';
import { Location } from '@angular/common';
import { City } from '../shared/models/event-types';
import { MatDividerModule } from '@angular/material/divider';
import * as L from 'leaflet';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [
    HttpClientModule,
    MatButtonModule,
    CommonModule,
    MatDividerModule
  ],
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.scss'
})
export class EventDetailComponent {
  eventId !: number;
  profile!: User;
  event!: EventDetails
  isPastEvent: boolean = false;
  isUserInMembers: boolean = false;

  private map: L.Map | undefined;

  constructor(
    private http: HttpClient,
    private router: Router,
    private navVisibilityService: NavigationVisibilityService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit() {
    this.navVisibilityService.hide();
    this.InitCityName();
    this.initMap();

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

    this.fetchEvent()
  }

  fetchEvent() {
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
      this.isUserInMembers = this.checkUserInEventMembers(this.event, this.profile.username);
      console.log('is user in event members : ', this.isUserInMembers)
    }
  }

  joinEvent() {
    const EventAPI = environment.apiUrl + '/Event/JoinEvent';

    const requestBody = {
      eventId: this.eventId,
    };

    this.http.post<JoinEventResponse>(EventAPI, requestBody).subscribe(
      (res) => {
        if (res.success) {
          this.fetchEvent()
        }
        else {
          console.log(res)
          console.log(this.eventId)
          console.log(this.event)
          this.toastr.error(res.message);
        }
      },
      (err) => {
        this.toastr.error('خطا در ثبت!');
      }
    );
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

  InitCityName() {
    if (1)
      this.http.get<City[]>('assets/cities.json').subscribe(data => {
        let city: City | undefined = data.find(x => x.cityId == 1);

        // this.event.cityName = city?.name ?? '';
      });
  }

  private initMap(): void {

    // Initialize the map
    this.map = L.map('map').setView([51.338062, 35.699768], 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    // Define a custom icon
    const customIcon = L.icon({
      iconUrl: 'assets/icons/location-marker.svg', // Path to your custom marker image
      iconSize: [32, 32], // Size of the icon [width, height]
      iconAnchor: [16, 32], // Anchor of the icon [x, y]
      popupAnchor: [0, -32], // Anchor of the popup relative to the icon
    });

    // Add the marker with the custom icon
    const marker = L.marker([51.338062, 35.699768], { icon: customIcon });
    marker.addTo(this.map);
  }
}
