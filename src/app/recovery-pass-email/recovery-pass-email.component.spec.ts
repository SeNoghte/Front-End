import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveryPassEmailComponent } from './recovery-pass-email.component';

describe('RecoveryPassEmailComponent', () => {
  let component: RecoveryPassEmailComponent;
  let fixture: ComponentFixture<RecoveryPassEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecoveryPassEmailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecoveryPassEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
