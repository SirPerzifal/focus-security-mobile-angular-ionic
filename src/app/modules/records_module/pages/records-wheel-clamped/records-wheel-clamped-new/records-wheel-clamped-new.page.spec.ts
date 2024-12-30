import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordsWheelClampedNewPage } from './records-wheel-clamped-new.page';

describe('RecordsWheelClampedNewPage', () => {
  let component: RecordsWheelClampedNewPage;
  let fixture: ComponentFixture<RecordsWheelClampedNewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordsWheelClampedNewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
