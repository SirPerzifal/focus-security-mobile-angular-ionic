import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResidentDealsPagePage } from './resident-deals-page.page';

describe('ResidentDealsPagePage', () => {
  let component: ResidentDealsPagePage;
  let fixture: ComponentFixture<ResidentDealsPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResidentDealsPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
