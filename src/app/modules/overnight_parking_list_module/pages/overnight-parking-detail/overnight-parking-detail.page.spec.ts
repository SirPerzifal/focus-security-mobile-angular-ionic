import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OvernightParkingDetailPage } from './overnight-parking-detail.page';

describe('OvernightParkingDetailPage', () => {
  let component: OvernightParkingDetailPage;
  let fixture: ComponentFixture<OvernightParkingDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OvernightParkingDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
