import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyPetsDetailPage } from './my-pets-detail.page';

describe('MyPetsDetailPage', () => {
  let component: MyPetsDetailPage;
  let fixture: ComponentFixture<MyPetsDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyPetsDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
