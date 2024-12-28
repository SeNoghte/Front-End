import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationVisibilityService } from '../services/navigation-visibility.service';
import { ToastrService } from 'ngx-toastr';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { City } from '../shared/models/event-types';
import {MatDividerModule} from '@angular/material/divider';
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

  event = {
    image: 'https://via.placeholder.com/100',
    profileImage: 'https://via.placeholder.com/40',
    name: 'محمد حسین',
    title: 'کوهنوردی در البرز',
    description:
      'برنامه مهیج و جذاب فتح بلند ترین قله ایران سه روزه حرکت از تهران |‌ ناهار با تور برای شرکت در این برنامه حتما باید قبلا سابقه صعود به قله ادامه توضیحات توضیحات بیشتر',
    date: 'پنجشنبه ۱۴۰۲/۰۹/۱۰ ساعت ۰۸:۰۰',
    members: [
      'امیرحسین',
      'رضا سادیسمی',
      'محمدرضا',
      'عرفان میرزایی',
      '56 نفر دیگه'
    ],
    cityId: 1,
    address: "علم و صنعت",
    longitude: 51.338062,
    latitude: 35.699768,
    cityName: ''
  }

  private map: L.Map | undefined;

  ngOnInit(): void {
    this.navVisibilityService.hide();
    this.InitCityName();
    this.initMap();
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private navVisibilityService: NavigationVisibilityService,
    private toastr: ToastrService,
  ) { }

  InitCityName() {
    if (this.event.cityId)
      this.http.get<City[]>('assets/cities.json').subscribe(data => {
        let city:City | undefined = data.find(x => x.cityId == this.event.cityId);
        
        this.event.cityName = city?.name ?? '';
      });
  }

  private initMap(): void {

        // Initialize the map
        this.map = L.map('map').setView([this.event.latitude, this.event.longitude], 13);

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
        const marker = L.marker([this.event.latitude, this.event.longitude], { icon: customIcon });
        marker.addTo(this.map);
  }
}
