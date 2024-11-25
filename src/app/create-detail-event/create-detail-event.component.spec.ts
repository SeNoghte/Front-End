import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDetailEventComponent } from './create-detail-event.component';

describe('CreateDetailEventComponent', () => {
  let component: CreateDetailEventComponent;
  let fixture: ComponentFixture<CreateDetailEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateDetailEventComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDetailEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
