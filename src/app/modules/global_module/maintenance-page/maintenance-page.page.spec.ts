import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaintenancePagePage } from './maintenance-page.page';

describe('MaintenancePagePage', () => {
  let component: MaintenancePagePage;
  let fixture: ComponentFixture<MaintenancePagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenancePagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
