import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationVisibilityService {
  private visibilitySubject = new BehaviorSubject<boolean>(true);
  visibility$ = this.visibilitySubject.asObservable();

  show() {
    this.visibilitySubject.next(true);
  }

  hide() {
    this.visibilitySubject.next(false);
  }
}
