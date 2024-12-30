import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpcomingPollingPage } from './upcoming-polling.page';

describe('UpcomingPollingPage', () => {
  let component: UpcomingPollingPage;
  let fixture: ComponentFixture<UpcomingPollingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UpcomingPollingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
