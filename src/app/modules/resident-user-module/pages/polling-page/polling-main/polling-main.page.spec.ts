import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PollingMainPage } from './polling-main.page';

describe('PollingMainPage', () => {
  let component: PollingMainPage;
  let fixture: ComponentFixture<PollingMainPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PollingMainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
