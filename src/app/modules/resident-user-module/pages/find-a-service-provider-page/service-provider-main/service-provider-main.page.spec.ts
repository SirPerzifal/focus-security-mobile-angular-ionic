import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiceProviderMainPage } from './service-provider-main.page';

describe('ServiceProviderMainPage', () => {
  let component: ServiceProviderMainPage;
  let fixture: ComponentFixture<ServiceProviderMainPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceProviderMainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
