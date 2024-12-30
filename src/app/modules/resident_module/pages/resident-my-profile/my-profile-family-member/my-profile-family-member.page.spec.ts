import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyProfileFamilyMemberPage } from './my-profile-family-member.page';

describe('MyProfileFamilyMemberPage', () => {
  let component: MyProfileFamilyMemberPage;
  let fixture: ComponentFixture<MyProfileFamilyMemberPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyProfileFamilyMemberPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
