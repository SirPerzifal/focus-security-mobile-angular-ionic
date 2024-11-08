import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginProcessPage } from './login-process.page';

describe('LoginProcessPage', () => {
  let component: LoginProcessPage;
  let fixture: ComponentFixture<LoginProcessPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginProcessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
