import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyProfileEstatePage } from './my-profile-estate.page';

describe('MyProfileEstatePage', () => {
  let component: MyProfileEstatePage;
  let fixture: ComponentFixture<MyProfileEstatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyProfileEstatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
