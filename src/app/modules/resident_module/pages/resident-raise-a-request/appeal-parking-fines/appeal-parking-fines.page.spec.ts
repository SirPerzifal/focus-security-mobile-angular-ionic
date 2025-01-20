import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppealParkingFinesPage } from './appeal-parking-fines.page';

describe('AppealParkingFinesPage', () => {
  let component: AppealParkingFinesPage;
  let fixture: ComponentFixture<AppealParkingFinesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AppealParkingFinesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
