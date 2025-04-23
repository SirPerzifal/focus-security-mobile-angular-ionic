import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BillsAndFinesPagePage } from './bills-and-fines-page.page';

describe('BillsAndFinesPagePage', () => {
  let component: BillsAndFinesPagePage;
  let fixture: ComponentFixture<BillsAndFinesPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BillsAndFinesPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
