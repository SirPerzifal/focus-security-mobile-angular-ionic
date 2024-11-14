import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginEndUserPage } from './login-end-user.page';

describe('LoginEndUserPage', () => {
  let component: LoginEndUserPage;
  let fixture: ComponentFixture<LoginEndUserPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginEndUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
