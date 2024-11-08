import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VmsBarcodePage } from './vms-barcode.page';

describe('VmsBarcodePage', () => {
  let component: VmsBarcodePage;
  let fixture: ComponentFixture<VmsBarcodePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VmsBarcodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
