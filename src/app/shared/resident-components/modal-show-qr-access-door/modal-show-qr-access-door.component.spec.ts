import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalShowQRAccessDoorComponent } from './modal-show-qr-access-door.component';

describe('ModalShowQRAccessDoorComponent', () => {
  let component: ModalShowQRAccessDoorComponent;
  let fixture: ComponentFixture<ModalShowQRAccessDoorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalShowQRAccessDoorComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalShowQRAccessDoorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
