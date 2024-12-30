import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertPaynowPage } from './alert-paynow.page';

describe('AlertPaynowPage', () => {
  let component: AlertPaynowPage;
  let fixture: ComponentFixture<AlertPaynowPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertPaynowPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
