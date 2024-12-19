import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OvernightParkingListPage } from './overnight-parking-list.page';

describe('OvernightParkingListPage', () => {
  let component: OvernightParkingListPage;
  let fixture: ComponentFixture<OvernightParkingListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OvernightParkingListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
