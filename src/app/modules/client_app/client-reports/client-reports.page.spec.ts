import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientReportsPage } from './client-reports.page';

describe('ClientReportsPage', () => {
  let component: ClientReportsPage;
  let fixture: ComponentFixture<ClientReportsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientReportsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
