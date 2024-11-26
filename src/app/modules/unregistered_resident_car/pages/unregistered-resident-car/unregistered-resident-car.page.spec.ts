import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnregisteredResidentCarPage } from './unregistered-resident-car.page';

describe('UnregisteredResidentCarPage', () => {
  let component: UnregisteredResidentCarPage;
  let fixture: ComponentFixture<UnregisteredResidentCarPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UnregisteredResidentCarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
