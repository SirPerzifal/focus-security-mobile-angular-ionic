import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConfirmationBeforeNextPageComponent } from './confirmation-before-next-page.component';

describe('ConfirmationBeforeNextPageComponent', () => {
  let component: ConfirmationBeforeNextPageComponent;
  let fixture: ComponentFixture<ConfirmationBeforeNextPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmationBeforeNextPageComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationBeforeNextPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
