import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResidentFindAServiceProviderPage } from './resident-find-a-service-provider.page';

describe('ResidentFindAServiceProviderPage', () => {
  let component: ResidentFindAServiceProviderPage;
  let fixture: ComponentFixture<ResidentFindAServiceProviderPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResidentFindAServiceProviderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
