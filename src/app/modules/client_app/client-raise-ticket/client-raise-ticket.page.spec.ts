import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientRaiseTicketPage } from './client-raise-ticket.page';

describe('ClientRaiseTicketPage', () => {
  let component: ClientRaiseTicketPage;
  let fixture: ComponentFixture<ClientRaiseTicketPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientRaiseTicketPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
