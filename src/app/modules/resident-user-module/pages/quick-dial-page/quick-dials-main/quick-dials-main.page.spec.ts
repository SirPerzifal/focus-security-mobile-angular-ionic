import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuickDialsMainPage } from './quick-dials-main.page';

describe('QuickDialsMainPage', () => {
  let component: QuickDialsMainPage;
  let fixture: ComponentFixture<QuickDialsMainPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickDialsMainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
