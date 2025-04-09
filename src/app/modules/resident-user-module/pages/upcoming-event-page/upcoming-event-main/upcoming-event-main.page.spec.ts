import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpcomingEventMainPage } from './upcoming-event-main.page';

describe('UpcomingEventMainPage', () => {
  let component: UpcomingEventMainPage;
  let fixture: ComponentFixture<UpcomingEventMainPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UpcomingEventMainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
