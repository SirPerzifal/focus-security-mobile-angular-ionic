import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResidentCarWarningClampPage } from './resident-car-warning-clamp.page';

describe('ResidentCarWarningClampPage', () => {
  let component: ResidentCarWarningClampPage;
  let fixture: ComponentFixture<ResidentCarWarningClampPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResidentCarWarningClampPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
