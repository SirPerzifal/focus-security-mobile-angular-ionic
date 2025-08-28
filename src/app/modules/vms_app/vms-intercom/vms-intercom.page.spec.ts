import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VmsIntercomPage } from './vms-intercom.page';

describe('VmsIntercomPage', () => {
  let component: VmsIntercomPage;
  let fixture: ComponentFixture<VmsIntercomPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VmsIntercomPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
