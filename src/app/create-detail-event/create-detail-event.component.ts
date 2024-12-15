import { Component, computed, inject, model, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { routes } from './../app.routes';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import * as L from 'leaflet';
import { BrowserModule } from '@angular/platform-browser';
import { City, EventDetail } from '../shared/models/event-types';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { log } from 'console';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-create-detail-event',
  standalone: true,
  imports: [
    MatSlideToggleModule,
    FormsModule,
    NgxMatTimepickerModule,
    CommonModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    HttpClientModule,
    MatChipsModule,
    MatIconModule],
  templateUrl: './create-detail-event.component.html',
  styleUrl: './create-detail-event.component.scss'
})
export class CreateDetailEventComponent implements OnInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly currentTask = signal('');
  readonly tasks = signal<string[]>([]);
  readonly allTasks: string[] = ['Meeting', 'Shopping', 'Exercise', 'Study', 'Cleaning'];
  readonly filteredTasks = computed(() => {
    const currentTask = this.currentTask().toLowerCase();
    return currentTask
      ? this.allTasks.filter(task => task.toLowerCase().includes(currentTask))
      : this.allTasks.slice();
  });


  readonly announcer = inject(LiveAnnouncer);

  addTask(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.tasks.update(tasks => [...tasks, value]);
    }


    this.currentTask.set('');
    if (event.input) {
      event.input.value = '';
    }
  }

  removeTask(task: string): void {
    this.tasks.update(tasks => {
      const index = tasks.indexOf(task);
      if (index < 0) {
        return tasks;
      }

      tasks.splice(index, 1);
      this.announcer.announce(`Removed ${task}`);
      return [...tasks];
    });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tasks.update(tasks => [...tasks, event.option.viewValue]);
    this.currentTask.set('');
    event.option.deselect();
  }

  showTimeField = false;
  eventDetails !: EventDetail;
  map: L.Map | undefined;
  marker: L.Marker | undefined;
  selectedCity!: City | undefined;
  selectedCityName!: string | undefined;

  cities: City[] = [];
  filteredCities: City[] = []

  isTaskBoxVisible: boolean = false;


  toggleTaskBox(): void {
    this.isTaskBoxVisible = !this.isTaskBoxVisible;
  }


  constructor(private Router: Router, private http: HttpClient) {

  }
  ngOnInit(): void {

    // این باید از API بگیره

    this.eventDetails = {
      address: "علم و صنعت",
      latitude: 35.699768,
      longitude: 51.338062,
      saveAddress: true,
      cityId: 1
    }

    this.InitCities();

  }

  redirectMainEvent() {
    this.Router.navigate(['create-event']);
  }

  InitCities() {
    this.http.get<City[]>('assets/cities.json').subscribe(data => {
      this.cities = [...data];
      this.filteredCities = [...data];
      this.initMap();
    });
  }

  private initMap(): void {
    if (this.eventDetails.saveAddress && this.eventDetails.cityId) {
      this.selectedCity = this.cities.find(x => x.cityId == this.eventDetails.cityId);
      this.selectedCityName = this.selectedCity?.name
    }
    else {
      this.selectedCity = this.cities.find(x => x.cityId == 1);
      this.selectedCityName = this.selectedCity?.name
    }

    if (this.eventDetails.saveAddress && this.eventDetails.latitude && this.eventDetails.longitude)
      this.map = L.map('map').setView([this.eventDetails.latitude, this.eventDetails.longitude], 13);
    else
      this.map = L.map('map').setView([35.699768, 51.338062], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    this.map.on('click', (event: L.LeafletMouseEvent) => {

      this.eventDetails.latitude = event.latlng.lat;
      this.eventDetails.longitude = event.latlng.lng;

      this.setMarker(event.latlng.lat, event.latlng.lng);
    });

    if (this.eventDetails.saveAddress && this.eventDetails.latitude && this.eventDetails.longitude) {
      this.setMarker(this.eventDetails.latitude, this.eventDetails.longitude);
    }

  }

  private setMarker(lat: number, lng: number): void {

    if (this.marker) {
      this.map?.removeLayer(this.marker);
    }

    const customIcon = L.divIcon({
      className: 'custom-icon',
      html: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FF5733" width="48px" height="48px">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
        </svg>
      `,
      iconSize: [48, 48],
      iconAnchor: [24, 48]
    });

    this.marker = L.marker([lat, lng], { icon: customIcon }).addTo(this.map!);
  }

  onCityChange(event: MatAutocompleteSelectedEvent): void {
    const selectedCityName = event.option.value;

    this.selectedCity = this.cities.find(c => c.name == selectedCityName);
    this.selectedCityName = this.selectedCity?.name;

    if (this.selectedCity && this.map) {
      this.map.setView([this.selectedCity.lat, this.selectedCity.lng], 13);
    }
  }

  SearchCities(event: string) {
    this.filteredCities = this.cities.filter(x => x.name.includes(event));
  }

  ToggleLoactionDisplay() {
    this.eventDetails.saveAddress = !this.eventDetails.saveAddress;
  }

}

