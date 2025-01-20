import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertModalPage } from './alert-modal.page';

describe('AlertModalPage', () => {
  let component: AlertModalPage;
  let fixture: ComponentFixture<AlertModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
