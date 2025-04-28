import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordsAlertNextPage } from './records-alert-next.page';

describe('RecordsAlertNextPage', () => {
  let component: RecordsAlertNextPage;
  let fixture: ComponentFixture<RecordsAlertNextPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordsAlertNextPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
