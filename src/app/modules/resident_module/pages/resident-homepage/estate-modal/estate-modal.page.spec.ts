import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EstateModalPage } from './estate-modal.page';

describe('EstateModalPage', () => {
  let component: EstateModalPage;
  let fixture: ComponentFixture<EstateModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EstateModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
