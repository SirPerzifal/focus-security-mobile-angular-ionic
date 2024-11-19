import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BillsFinesPage } from './bills-fines.page';

describe('BillsFinesPage', () => {
  let component: BillsFinesPage;
  let fixture: ComponentFixture<BillsFinesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BillsFinesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
