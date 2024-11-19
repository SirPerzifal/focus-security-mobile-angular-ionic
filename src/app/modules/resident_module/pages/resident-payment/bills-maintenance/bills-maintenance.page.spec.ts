import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BillsMaintenancePage } from './bills-maintenance.page';

describe('BillsMaintenancePage', () => {
  let component: BillsMaintenancePage;
  let fixture: ComponentFixture<BillsMaintenancePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BillsMaintenancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
