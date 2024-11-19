import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BillsHistoryPage } from './bills-history.page';

describe('BillsHistoryPage', () => {
  let component: BillsHistoryPage;
  let fixture: ComponentFixture<BillsHistoryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BillsHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
