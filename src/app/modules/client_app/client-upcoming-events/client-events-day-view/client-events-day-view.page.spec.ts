import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientEventsDayViewPage } from './client-events-day-view.page';

describe('ClientEventsDayViewPage', () => {
  let component: ClientEventsDayViewPage;
  let fixture: ComponentFixture<ClientEventsDayViewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientEventsDayViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
