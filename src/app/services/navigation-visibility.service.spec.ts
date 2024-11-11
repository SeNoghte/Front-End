import { TestBed } from '@angular/core/testing';

import { NavigationVisibilityService } from './navigation-visibility.service';

describe('NavigationVisibilityService', () => {
  let service: NavigationVisibilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavigationVisibilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
