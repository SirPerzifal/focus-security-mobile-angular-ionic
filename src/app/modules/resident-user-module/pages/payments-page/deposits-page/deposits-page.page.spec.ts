import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DepositsPagePage } from './deposits-page.page';

describe('DepositsPagePage', () => {
  let component: DepositsPagePage;
  let fixture: ComponentFixture<DepositsPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositsPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
