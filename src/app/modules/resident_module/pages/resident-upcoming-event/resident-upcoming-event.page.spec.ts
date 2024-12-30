import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResidentUpcomingEventPage } from './resident-upcoming-event.page';

describe('ResidentUpcomingEventPage', () => {
  let component: ResidentUpcomingEventPage;
  let fixture: ComponentFixture<ResidentUpcomingEventPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResidentUpcomingEventPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
