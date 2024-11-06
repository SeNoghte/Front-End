import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpAuthComponent } from './sign-up-auth.component';

describe('SignUpAuthComponent', () => {
  let component: SignUpAuthComponent;
  let fixture: ComponentFixture<SignUpAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUpAuthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignUpAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
