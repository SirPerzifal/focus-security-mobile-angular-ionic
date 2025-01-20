import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RenovationPermitPage } from './renovation-permit.page';

describe('RenovationPermitPage', () => {
  let component: RenovationPermitPage;
  let fixture: ComponentFixture<RenovationPermitPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RenovationPermitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
