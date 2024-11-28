import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveryPassCodeComponent } from './recovery-pass-code.component';

describe('RecoveryPassCodeComponent', () => {
  let component: RecoveryPassCodeComponent;
  let fixture: ComponentFixture<RecoveryPassCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecoveryPassCodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecoveryPassCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
