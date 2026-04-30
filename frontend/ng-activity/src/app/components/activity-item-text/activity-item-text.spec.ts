import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityItemText } from './activity-item-text';

describe('ActivityItemText', () => {
  let component: ActivityItemText;
  let fixture: ComponentFixture<ActivityItemText>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityItemText]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivityItemText);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
