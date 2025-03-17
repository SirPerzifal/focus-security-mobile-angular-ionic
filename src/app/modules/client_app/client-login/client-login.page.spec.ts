import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientLoginPage } from './client-login.page';

describe('ClientLoginPage', () => {
  let component: ClientLoginPage;
  let fixture: ComponentFixture<ClientLoginPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientLoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
