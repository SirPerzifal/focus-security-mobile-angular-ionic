import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientNotificationPage } from './client-notification.page';

describe('ClientNotificationPage', () => {
  let component: ClientNotificationPage;
  let fixture: ComponentFixture<ClientNotificationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientNotificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
