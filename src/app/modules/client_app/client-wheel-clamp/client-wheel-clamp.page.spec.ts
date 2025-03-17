import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientWheelClampPage } from './client-wheel-clamp.page';

describe('ClientWheelClampPage', () => {
  let component: ClientWheelClampPage;
  let fixture: ComponentFixture<ClientWheelClampPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientWheelClampPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
