import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationVisibilityService } from '../services/navigation-visibility.service';
import { ToastrService } from 'ngx-toastr';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EventDetails, GetEventApiResponse, GetLeaveEventApiResponse, GetProfileApiResponse, JoinEventRequest, JoinEventResponse, User } from '../shared/models/group-model-type';
import { environment } from '../../environments/environment';
import { log } from 'node:console';
import { Location } from '@angular/common';
import { City } from '../shared/models/event-types';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import * as L from 'leaflet';
import moment from 'moment-jalaali';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


export interface Task {
  id: string;
  title: string;
  assignedUserId: string;
  assignedUserName: string;
}

export interface Tag {
  id: string;
  tag: string;
}


@Component({
  selector: 'app-event-detail',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    HttpClientModule,
    MatButtonModule,
    CommonModule,
    MatDividerModule,
    MatChipsModule,
    MatInputModule,

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
  persianDate: string = '';
  private map: L.Map | undefined;
  tasksAssigned: any[] = [];
  tasksUnassigned: any[] = [];
  tags: string[] = [];
  isEventPrivate: boolean = false;


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
    this.initPage();
  }

  initPage(){
    const GetProfileAPI = environment.apiUrl + '/User/Profile';

    this.http.post<GetProfileApiResponse>(GetProfileAPI, {}).subscribe(
      (res) => {
        this.profile = res.user as unknown as User

        this.route.queryParams.subscribe((params) => {
          this.eventId = params['id'];
        });

        this.fetchEvent()
      },
      (err) => {
        this.toastr.error('خطا در ثبت!');
      }
    );
  }

  LeaveEvent() {
    const LeaveEvent = environment.apiUrl + '/Event/LeaveEvent';

    const requestBody = {
      eventId: this.eventId,
    };

    this.http.post<GetLeaveEventApiResponse>(LeaveEvent, requestBody).subscribe(
      (res) => {
        if (res.success) {
          this.toastr.success('با موفقیت از رویداد خارح شدی!');
          this.fetchEvent()
        }
      },
      (err) => {
        this.toastr.error('خطا در ثبت!');
      }
    );
  }

  fetchEvent() {
    const GetEventAPI = environment.apiUrl + '/Event/GetEvent';

    const requestBody = { eventId: this.eventId };

    this.http.post<GetEventApiResponse>(GetEventAPI, requestBody).subscribe(
      (res) => {
        if (res.success) {
          this.event = res.event as unknown as EventDetails;;
          // this.isEventPrivate = this.event.isPrivate;
        
          this.persianDate = moment(this.event.date, 'YYYY-MM-DD')
            .locale('fa')
            .format('dddd jD jMMMM jYYYY');

          const eventDateTime = new Date(`${this.event.date}T${this.event.time}`);
          const currentDateTime = new Date();
          this.isPastEvent = currentDateTime > eventDateTime;

          if (this.event.members!!.length > 0) {
            this.isUserInMembers = this.checkUserInEventMembers(this.event, this.profile.username);
          }
          else {
            this.isUserInMembers = false;
          }

          console.log('is user in members : ' , this.isUserInMembers)
          console.log('is event passed : ' , this.isPastEvent)

          this.tasksAssigned = res.tasks.filter((task: Task) => task.assignedUserId);
          this.tasksUnassigned = res.tasks.filter((task: Task) => !task.assignedUserId);

          this.tags = res.tags.map((tag: Tag) => tag.tag);
        } else {
          this.toastr.error(res.message || 'اطلاعات دریافتی ناقص است.');
        }
      },
      (err) => {
        console.error('Error fetching event:', err);
        this.toastr.error(err.error?.message || 'خطا در دریافت اطلاعات رویداد!');
      }
    );
  }


  assignTaskToMe(taskId: string) {
    const AssignTaskAPI = environment.apiUrl + '/Event/AssignTaskToMe';

    const requestBody = { taskId };

    this.http.post(AssignTaskAPI, requestBody).subscribe(
      (res: any) => {
        if (res.success) {
          const assignedTaskIndex = this.tasksUnassigned.findIndex(
            (task) => task.id === taskId
          );
          if (assignedTaskIndex !== -1) {
            const assignedTask = this.tasksUnassigned.splice(assignedTaskIndex, 1)[0];
            assignedTask.assignedUserId = this.profile.userId;
            assignedTask.assignedUserName = this.profile.name;
            this.tasksAssigned.push(assignedTask);
          }
          this.toastr.success('تسک به شما اختصاص یافت.');
        } else {
          this.toastr.error(res.message || 'خطا در اختصاص تسک.');
        }
      },
      (err) => {
        console.error('Error assigning task:', err);
        this.toastr.error('خطا در اختصاص تسک.');
      }
    );
  }

  removeTaskFromMe(taskId: string) {
    const RemoveTaskAPI = environment.apiUrl + '/Event/RemoveTaskFromMe';

    const requestBody = { taskId };

    this.http.post(RemoveTaskAPI, requestBody).subscribe(
      (res: any) => {
        if (res.success) {
          const removedTaskIndex = this.tasksAssigned.findIndex(
            (task) => task.id === taskId
          );
          if (removedTaskIndex !== -1) {
            const removedTask = this.tasksAssigned.splice(removedTaskIndex, 1)[0];
            removedTask.assignedUserId = null;
            removedTask.assignedUserName = null;
            this.tasksUnassigned.push(removedTask);
          }
          this.toastr.success('تسک از شما حذف شد.');
        } else {
          this.toastr.error(res.message || 'خطا در حذف تسک.');
        }
      },
      (err) => {
        console.error('Error removing task:', err);
        this.toastr.error('خطا در حذف تسک.');
      }
    );
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
          this.toastr.success("با موفقیت عضو شدی!");
        }
        else {
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
      return false;
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
