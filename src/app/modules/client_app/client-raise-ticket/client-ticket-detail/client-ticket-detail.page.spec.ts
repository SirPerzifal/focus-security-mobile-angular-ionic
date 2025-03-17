import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientTicketDetailPage } from './client-ticket-detail.page';

describe('ClientTicketDetailPage', () => {
  let component: ClientTicketDetailPage;
  let fixture: ComponentFixture<ClientTicketDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientTicketDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
