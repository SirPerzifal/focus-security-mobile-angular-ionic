import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResidentRaiseARequestPage } from './resident-raise-a-request.page';

describe('ResidentRaiseARequestPage', () => {
  let component: ResidentRaiseARequestPage;
  let fixture: ComponentFixture<ResidentRaiseARequestPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResidentRaiseARequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
