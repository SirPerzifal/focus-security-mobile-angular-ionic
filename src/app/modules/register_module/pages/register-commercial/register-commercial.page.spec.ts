import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterCommercialPage } from './register-commercial.page';

describe('RegisterCommercialPage', () => {
  let component: RegisterCommercialPage;
  let fixture: ComponentFixture<RegisterCommercialPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterCommercialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
