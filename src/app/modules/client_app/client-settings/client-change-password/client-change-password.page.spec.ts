import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientChangePasswordPage } from './client-change-password.page';

describe('ClientChangePasswordPage', () => {
  let component: ClientChangePasswordPage;
  let fixture: ComponentFixture<ClientChangePasswordPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientChangePasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
