import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryUpcomingEventPage } from './history-upcoming-event.page';

describe('HistoryUpcomingEventPage', () => {
  let component: HistoryUpcomingEventPage;
  let fixture: ComponentFixture<HistoryUpcomingEventPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryUpcomingEventPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
