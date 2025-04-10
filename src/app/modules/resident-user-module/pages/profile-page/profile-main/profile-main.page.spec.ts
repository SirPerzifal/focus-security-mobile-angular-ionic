import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileMainPage } from './profile-main.page';

describe('ProfileMainPage', () => {
  let component: ProfileMainPage;
  let fixture: ComponentFixture<ProfileMainPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileMainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
