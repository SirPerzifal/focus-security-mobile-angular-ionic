import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResidentHouseRulesPage } from './resident-house-rules.page';

describe('ResidentHouseRulesPage', () => {
  let component: ResidentHouseRulesPage;
  let fixture: ComponentFixture<ResidentHouseRulesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResidentHouseRulesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
