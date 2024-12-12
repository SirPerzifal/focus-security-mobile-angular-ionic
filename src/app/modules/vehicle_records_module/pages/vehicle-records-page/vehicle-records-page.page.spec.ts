import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleRecordsPagePage } from './vehicle-records-page.page';

describe('VehicleRecordsPagePage', () => {
  let component: VehicleRecordsPagePage;
  let fixture: ComponentFixture<VehicleRecordsPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleRecordsPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
