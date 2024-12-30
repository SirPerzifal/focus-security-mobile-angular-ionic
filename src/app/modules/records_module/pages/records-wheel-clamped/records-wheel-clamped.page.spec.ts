import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordsWheelClampedPage } from './records-wheel-clamped.page';

describe('RecordsWheelClampedPage', () => {
  let component: RecordsWheelClampedPage;
  let fixture: ComponentFixture<RecordsWheelClampedPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordsWheelClampedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
