import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FacilityDepositsPage } from './facility-deposits.page';

describe('FacilityDepositsPage', () => {
  let component: FacilityDepositsPage;
  let fixture: ComponentFixture<FacilityDepositsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityDepositsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
