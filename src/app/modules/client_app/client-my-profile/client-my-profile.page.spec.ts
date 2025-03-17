import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientMyProfilePage } from './client-my-profile.page';

describe('ClientMyProfilePage', () => {
  let component: ClientMyProfilePage;
  let fixture: ComponentFixture<ClientMyProfilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientMyProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
