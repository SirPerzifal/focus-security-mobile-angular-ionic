import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchNricConfirmationPage } from './search-nric-confirmation.page';

describe('SearchNricConfirmationPage', () => {
  let component: SearchNricConfirmationPage;
  let fixture: ComponentFixture<SearchNricConfirmationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchNricConfirmationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
