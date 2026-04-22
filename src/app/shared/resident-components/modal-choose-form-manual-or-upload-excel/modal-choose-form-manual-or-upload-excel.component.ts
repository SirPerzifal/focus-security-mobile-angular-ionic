import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-choose-form-manual-or-upload-excel',
  templateUrl: './modal-choose-form-manual-or-upload-excel.component.html',
  styleUrls: ['./modal-choose-form-manual-or-upload-excel.component.scss'],
})
export class ModalChooseFormManualOrUploadExcelComponent  implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  onClickSubmitType(submitType: any) {
    this.modalController.dismiss(submitType)
  }

}
