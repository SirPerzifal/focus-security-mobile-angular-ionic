import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PetsDetailForProfilePage } from './pets-detail-for-profile.page';

describe('PetsDetailForProfilePage', () => {
  let component: PetsDetailForProfilePage;
  let fixture: ComponentFixture<PetsDetailForProfilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PetsDetailForProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
