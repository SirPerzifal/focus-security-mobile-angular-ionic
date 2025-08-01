import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VmsGatePage } from './vms-gate.page';

describe('VmsGatePage', () => {
  let component: VmsGatePage;
  let fixture: ComponentFixture<VmsGatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VmsGatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
