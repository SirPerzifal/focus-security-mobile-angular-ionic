import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientEventsDetailPage } from './client-events-detail.page';

describe('ClientEventsDetailPage', () => {
  let component: ClientEventsDetailPage;
  let fixture: ComponentFixture<ClientEventsDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientEventsDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
