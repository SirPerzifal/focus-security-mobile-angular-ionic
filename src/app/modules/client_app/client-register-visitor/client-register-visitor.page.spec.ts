import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientRegisterVisitorPage } from './client-register-visitor.page';

describe('ClientRegisterVisitorPage', () => {
  let component: ClientRegisterVisitorPage;
  let fixture: ComponentFixture<ClientRegisterVisitorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientRegisterVisitorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
