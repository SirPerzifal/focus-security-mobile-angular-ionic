import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyProfileMyPetsPage } from './my-profile-my-pets.page';

describe('MyProfileMyPetsPage', () => {
  let component: MyProfileMyPetsPage;
  let fixture: ComponentFixture<MyProfileMyPetsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyProfileMyPetsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
