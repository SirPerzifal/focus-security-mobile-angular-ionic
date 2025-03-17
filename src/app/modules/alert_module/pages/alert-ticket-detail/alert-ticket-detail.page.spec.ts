import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertTicketDetailPage } from './alert-ticket-detail.page';

describe('AlertTicketDetailPage', () => {
  let component: AlertTicketDetailPage;
  let fixture: ComponentFixture<AlertTicketDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertTicketDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
