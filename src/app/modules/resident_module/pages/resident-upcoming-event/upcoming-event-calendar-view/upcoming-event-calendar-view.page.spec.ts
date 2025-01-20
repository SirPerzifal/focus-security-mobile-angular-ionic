import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpcomingEventCalendarViewPage } from './upcoming-event-calendar-view.page';

describe('UpcomingEventCalendarViewPage', () => {
  let component: UpcomingEventCalendarViewPage;
  let fixture: ComponentFixture<UpcomingEventCalendarViewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UpcomingEventCalendarViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
