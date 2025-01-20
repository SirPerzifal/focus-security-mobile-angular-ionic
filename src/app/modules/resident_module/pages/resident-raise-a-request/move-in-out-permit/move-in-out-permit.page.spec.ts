import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoveInOutPermitPage } from './move-in-out-permit.page';

describe('MoveInOutPermitPage', () => {
  let component: MoveInOutPermitPage;
  let fixture: ComponentFixture<MoveInOutPermitPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveInOutPermitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
