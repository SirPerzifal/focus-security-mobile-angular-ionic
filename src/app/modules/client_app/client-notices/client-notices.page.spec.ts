import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientNoticesPage } from './client-notices.page';

describe('ClientNoticesPage', () => {
  let component: ClientNoticesPage;
  let fixture: ComponentFixture<ClientNoticesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientNoticesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
