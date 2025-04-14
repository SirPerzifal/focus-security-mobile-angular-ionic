import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentsMainPage } from './payments-main.page';

describe('PaymentsMainPage', () => {
  let component: PaymentsMainPage;
  let fixture: ComponentFixture<PaymentsMainPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentsMainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
