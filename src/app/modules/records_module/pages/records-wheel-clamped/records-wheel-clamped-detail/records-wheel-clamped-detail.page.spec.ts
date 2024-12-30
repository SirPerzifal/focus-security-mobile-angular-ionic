import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordsWheelClampedDetailPage } from './records-wheel-clamped-detail.page';

describe('RecordsWheelClampedDetailPage', () => {
  let component: RecordsWheelClampedDetailPage;
  let fixture: ComponentFixture<RecordsWheelClampedDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordsWheelClampedDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
