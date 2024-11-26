import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveryPassNewPassComponent } from './recovery-pass-new-pass.component';

describe('RecoveryPassNewPassComponent', () => {
  let component: RecoveryPassNewPassComponent;
  let fixture: ComponentFixture<RecoveryPassNewPassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecoveryPassNewPassComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecoveryPassNewPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
