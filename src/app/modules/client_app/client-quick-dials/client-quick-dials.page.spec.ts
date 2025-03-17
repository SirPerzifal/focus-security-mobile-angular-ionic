import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientQuickDialsPage } from './client-quick-dials.page';

describe('ClientQuickDialsPage', () => {
  let component: ClientQuickDialsPage;
  let fixture: ComponentFixture<ClientQuickDialsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientQuickDialsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
