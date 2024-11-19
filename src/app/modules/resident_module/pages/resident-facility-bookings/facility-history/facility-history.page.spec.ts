import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FacilityHistoryPage } from './facility-history.page';

describe('FacilityHistoryPage', () => {
  let component: FacilityHistoryPage;
  let fixture: ComponentFixture<FacilityHistoryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
