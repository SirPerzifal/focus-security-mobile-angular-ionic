import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResidentQuickDialsPage } from './resident-quick-dials.page';

describe('ResidentQuickDialsPage', () => {
  let component: ResidentQuickDialsPage;
  let fixture: ComponentFixture<ResidentQuickDialsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResidentQuickDialsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
