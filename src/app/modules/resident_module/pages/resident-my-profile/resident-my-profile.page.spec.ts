import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResidentMyProfilePage } from './resident-my-profile.page';

describe('ResidentMyProfilePage', () => {
  let component: ResidentMyProfilePage;
  let fixture: ComponentFixture<ResidentMyProfilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResidentMyProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
