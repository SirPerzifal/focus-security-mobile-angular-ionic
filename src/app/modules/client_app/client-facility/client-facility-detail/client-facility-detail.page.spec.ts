import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientFacilityDetailPage } from './client-facility-detail.page';

describe('ClientFacilityDetailPage', () => {
  let component: ClientFacilityDetailPage;
  let fixture: ComponentFixture<ClientFacilityDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientFacilityDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
