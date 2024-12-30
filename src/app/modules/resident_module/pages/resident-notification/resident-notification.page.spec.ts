import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResidentNotificationPage } from './resident-notification.page';

describe('ResidentNotificationPage', () => {
  let component: ResidentNotificationPage;
  let fixture: ComponentFixture<ResidentNotificationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResidentNotificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
