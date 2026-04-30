import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityItemImage } from './activity-item-image';

describe('ActivityItemImage', () => {
  let component: ActivityItemImage;
  let fixture: ComponentFixture<ActivityItemImage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityItemImage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivityItemImage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
