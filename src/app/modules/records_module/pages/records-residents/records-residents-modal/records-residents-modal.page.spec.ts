import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordsResidentsModalPage } from './records-residents-modal.page';

describe('RecordsResidentsModalPage', () => {
  let component: RecordsResidentsModalPage;
  let fixture: ComponentFixture<RecordsResidentsModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordsResidentsModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
