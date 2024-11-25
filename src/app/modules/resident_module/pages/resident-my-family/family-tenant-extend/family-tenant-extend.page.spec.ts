import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FamilyTenantExtendPage } from './family-tenant-extend.page';

describe('FamilyTenantExtendPage', () => {
  let component: FamilyTenantExtendPage;
  let fixture: ComponentFixture<FamilyTenantExtendPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyTenantExtendPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
