import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientFacilityPage } from './client-facility.page';

describe('ClientFacilityPage', () => {
  let component: ClientFacilityPage;
  let fixture: ComponentFixture<ClientFacilityPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientFacilityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
