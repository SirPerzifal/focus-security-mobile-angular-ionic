import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RaiseARequestMainPage } from './raise-a-request-main.page';

describe('RaiseARequestMainPage', () => {
  let component: RaiseARequestMainPage;
  let fixture: ComponentFixture<RaiseARequestMainPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RaiseARequestMainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
