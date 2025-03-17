import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientUpcomingEventsPage } from './client-upcoming-events.page';

describe('ClientUpcomingEventsPage', () => {
  let component: ClientUpcomingEventsPage;
  let fixture: ComponentFixture<ClientUpcomingEventsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientUpcomingEventsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
