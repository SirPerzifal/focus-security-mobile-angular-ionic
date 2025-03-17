import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientPollingPage } from './client-polling.page';

describe('ClientPollingPage', () => {
  let component: ClientPollingPage;
  let fixture: ComponentFixture<ClientPollingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientPollingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
