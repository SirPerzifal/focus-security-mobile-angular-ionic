import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResidentVisitorsPage } from './resident-visitors.page';

describe('ResidentVisitorsPage', () => {
  let component: ResidentVisitorsPage;
  let fixture: ComponentFixture<ResidentVisitorsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResidentVisitorsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
