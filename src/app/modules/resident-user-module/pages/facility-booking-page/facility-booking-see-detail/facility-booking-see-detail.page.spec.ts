import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FacilityBookingSeeDetailPage } from './facility-booking-see-detail.page';

describe('FacilityBookingSeeDetailPage', () => {
  let component: FacilityBookingSeeDetailPage;
  let fixture: ComponentFixture<FacilityBookingSeeDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityBookingSeeDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
