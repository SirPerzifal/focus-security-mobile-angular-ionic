import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalPaymentManualCustomComponent } from './modal-payment-manual-custom.component';

describe('ModalPaymentManualCustomComponent', () => {
  let component: ModalPaymentManualCustomComponent;
  let fixture: ComponentFixture<ModalPaymentManualCustomComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPaymentManualCustomComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalPaymentManualCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
