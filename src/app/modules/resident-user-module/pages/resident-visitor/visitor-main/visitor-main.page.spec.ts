import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VisitorMainPage } from './visitor-main.page';

describe('VisitorMainPage', () => {
  let component: VisitorMainPage;
  let fixture: ComponentFixture<VisitorMainPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorMainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
