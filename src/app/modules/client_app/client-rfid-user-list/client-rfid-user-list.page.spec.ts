import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientRfidUserListPage } from './client-rfid-user-list.page';

describe('ClientRfidUserListPage', () => {
  let component: ClientRfidUserListPage;
  let fixture: ComponentFixture<ClientRfidUserListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientRfidUserListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
