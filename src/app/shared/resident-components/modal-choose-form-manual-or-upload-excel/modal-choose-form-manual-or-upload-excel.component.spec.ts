import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalChooseFormManualOrUploadExcelComponent } from './modal-choose-form-manual-or-upload-excel.component';

describe('ModalChooseFormManualOrUploadExcelComponent', () => {
  let component: ModalChooseFormManualOrUploadExcelComponent;
  let fixture: ComponentFixture<ModalChooseFormManualOrUploadExcelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalChooseFormManualOrUploadExcelComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalChooseFormManualOrUploadExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
