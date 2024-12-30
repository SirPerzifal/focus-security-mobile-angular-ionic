import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClosedPollingPage } from './closed-polling.page';

describe('ClosedPollingPage', () => {
  let component: ClosedPollingPage;
  let fixture: ComponentFixture<ClosedPollingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClosedPollingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
