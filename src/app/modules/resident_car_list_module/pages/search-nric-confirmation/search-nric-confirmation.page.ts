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
    const closeModalOnBack = () => {
      this.modalController.dismiss(false);
      window.removeEventListener('popstate', closeModalOnBack);
    };
    window.addEventListener('popstate', closeModalOnBack)
  }

  nric_confirmation = ''

  onConfirm() {
    if (this.nric_confirmation == ''){
      this.functionMain.presentToast('NRIC is required!', 'danger')
    } else {
      console.log(this.nric_confirmation)
      this.modalController.dismiss(this.nric_confirmation)
    }
    
  }

  onCancel() {
    this.modalController.dismiss(false)
  }
}
