import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RaiseRequestFormPagePage } from './raise-request-form-page.page';

describe('RaiseRequestFormPagePage', () => {
  let component: RaiseRequestFormPagePage;
  let fixture: ComponentFixture<RaiseRequestFormPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RaiseRequestFormPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
