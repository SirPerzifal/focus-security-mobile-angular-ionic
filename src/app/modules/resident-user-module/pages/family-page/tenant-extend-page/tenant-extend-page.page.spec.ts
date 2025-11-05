import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TenantExtendPagePage } from './tenant-extend-page.page';

describe('TenantExtendPagePage', () => {
  let component: TenantExtendPagePage;
  let fixture: ComponentFixture<TenantExtendPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantExtendPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
