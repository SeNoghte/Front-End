import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpEndComponent } from './sign-up-end.component';

describe('SignUpEndComponent', () => {
  let component: SignUpEndComponent;
  let fixture: ComponentFixture<SignUpEndComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUpEndComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignUpEndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
