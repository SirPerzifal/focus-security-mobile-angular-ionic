import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccessCardApplicationPage } from './access-card-application.page';

describe('AccessCardApplicationPage', () => {
  let component: AccessCardApplicationPage;
  let fixture: ComponentFixture<AccessCardApplicationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessCardApplicationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
