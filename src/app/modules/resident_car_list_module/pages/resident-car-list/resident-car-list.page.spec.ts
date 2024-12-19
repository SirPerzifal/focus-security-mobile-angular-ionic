import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResidentCarListPage } from './resident-car-list.page';

describe('ResidentCarListPage', () => {
  let component: ResidentCarListPage;
  let fixture: ComponentFixture<ResidentCarListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResidentCarListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
