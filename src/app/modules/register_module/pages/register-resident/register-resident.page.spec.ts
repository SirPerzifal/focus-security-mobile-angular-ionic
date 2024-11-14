import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterResidentPage } from './register-resident.page';

describe('RegisterResidentPage', () => {
  let component: RegisterResidentPage;
  let fixture: ComponentFixture<RegisterResidentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterResidentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
