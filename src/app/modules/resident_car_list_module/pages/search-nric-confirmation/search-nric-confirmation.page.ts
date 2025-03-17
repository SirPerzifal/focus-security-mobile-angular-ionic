import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-search-nric-confirmation',
  templateUrl: './search-nric-confirmation.page.html',
  styleUrls: ['./search-nric-confirmation.page.scss'],
})
export class SearchNricConfirmationPage implements OnInit {

  constructor(private modalController: ModalController, private functionMain: FunctionMainService) { }

  ngOnInit() {
  }

  nric_confirmation = ''

  onConfirm() {
    if (this.nric_confirmation == ''){
      this.functionMain.presentToast('NRIC is required!', 'danger')
    } else {
      this.modalController.dismiss(this.nric_confirmation)
    }
    
  }

  onCancel() {
    this.modalController.dismiss(false)
  }
}
