import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientMainAppPage } from './client-main-app.page';

describe('ClientMainAppPage', () => {
  let component: ClientMainAppPage;
  let fixture: ComponentFixture<ClientMainAppPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientMainAppPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
