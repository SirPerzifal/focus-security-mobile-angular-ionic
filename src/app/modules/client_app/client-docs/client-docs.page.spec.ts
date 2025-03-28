import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientDocsPage } from './client-docs.page';

describe('ClientDocsPage', () => {
  let component: ClientDocsPage;
  let fixture: ComponentFixture<ClientDocsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientDocsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
