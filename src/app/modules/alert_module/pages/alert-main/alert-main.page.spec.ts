import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertMainPage } from './alert-main.page';

describe('AlertMainPage', () => {
  let component: AlertMainPage;
  let fixture: ComponentFixture<AlertMainPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertMainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
