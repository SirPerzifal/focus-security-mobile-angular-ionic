import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResidentPollingPage } from './resident-polling.page';

describe('ResidentPollingPage', () => {
  let component: ResidentPollingPage;
  let fixture: ComponentFixture<ResidentPollingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResidentPollingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
