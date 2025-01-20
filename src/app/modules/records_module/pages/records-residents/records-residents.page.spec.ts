import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordsResidentsPage } from './records-residents.page';

describe('RecordsResidentsPage', () => {
  let component: RecordsResidentsPage;
  let fixture: ComponentFixture<RecordsResidentsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordsResidentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
