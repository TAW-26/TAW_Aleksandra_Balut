import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventMap } from './event-map';

describe('EventMap', () => {
  let component: EventMap;
  let fixture: ComponentFixture<EventMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventMap]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventMap);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
