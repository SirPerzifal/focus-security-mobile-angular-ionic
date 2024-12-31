import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyProfileAddEstatePage } from './my-profile-add-estate.page';

describe('MyProfileAddEstatePage', () => {
  let component: MyProfileAddEstatePage;
  let fixture: ComponentFixture<MyProfileAddEstatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyProfileAddEstatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
