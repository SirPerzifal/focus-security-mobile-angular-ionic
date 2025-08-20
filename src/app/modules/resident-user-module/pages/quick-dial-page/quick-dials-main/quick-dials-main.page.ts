import { Component, OnInit } from '@angular/core';

import { StorageService } from 'src/app/service/storage/storage.service';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { QuickDial } from 'src/models/resident/quickDials.model';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { WebRtcService } from 'src/app/service/fs-web-rtc/web-rtc.service';
import { Estate } from 'src/models/resident/resident.model';

@Component({
  selector: 'app-quick-dials-main',
  templateUrl: './quick-dials-main.page.html',
  styleUrls: ['./quick-dials-main.page.scss'],
})
export class QuickDialsMainPage implements OnInit {
  quickDials: QuickDial[] = [];
  projectId: number = 0;

  isAnimating: boolean = false;

  isLoading: boolean = true;

  constructor(
    private mainApiResidentService: MainApiResidentService,
    public functionMain: FunctionMainService,
    private webRtcService: WebRtcService,
    private storage: StorageService,
  ) { }

  ngOnInit() {
    this.storage.getValueFromStorage('USESATE_DATA').then((value: any) => {
      if ( value ) {
        this.storage.decodeData(value).then((value: any) => {
          if ( value ) {
            const estate = JSON.parse(value) as Estate;
            this.projectId = estate.project_id;
            this.loadQuickDials();
          }
        })
      } 
    })
  }

  handleRefresh(event: any) {
    this.isLoading = true;
    setTimeout(() => {
      this.storage.getValueFromStorage('USESATE_DATA').then((value: any) => {
        if ( value ) {
          this.storage.decodeData(value).then((value: any) => {
            if ( value ) {
              const estate = JSON.parse(value) as Estate;
              this.projectId = estate.project_id;
              this.loadQuickDials();
            }
          })
        } 
      })
      event.target.complete();
    }, 1000)
  }

 loadQuickDials() {
  this.mainApiResidentService.endpointMainProcess({}, 'get/contact_list').subscribe((result: any) => {
    // // console.log(result);
    this.quickDials = result.result.response_result
    if (this.quickDials) {
      console.log(this.quickDials);
      this.isLoading = false;
    }
    // // console.log(this.quickDials);
  })
 }

  isModalDetailPhone = false;
  dataSelect = {
    image: '',
    name: '',
    is_add: false,
    can_call_with: '',
    for_what_user: '',
    related_account: 0,
    contact_number: '',
    is_whatsapp: false,
    id: 0
  }

  pushedModalState = false
  onClickCallButton(contact: any) {
    console.log(contact);
    
    if (contact.can_call_with === 'phone_dial') {
      if (contact.is_whatsapp) {
        this.dataSelect = {
          name: contact.name,
          contact_number: contact.mobile_number,
          is_add: contact.is_add,
          can_call_with: contact.can_call_with,
          for_what_user: contact.for_what_user,
          related_account: contact.related_account,
          image: contact.image,
          id: contact.id,
          is_whatsapp: contact.is_whatsapp,
        }
        this.isModalDetailPhone = true
        console.log("data select for phone dial is whatsapp true", this.dataSelect);
      } else {
        this.actionToPhoneDial(contact.mobile_number)
      }
    } else if (contact.can_call_with === 'in_app_call') {
      if (contact.for_what_user === 'vms') {
        this.actionToInAppCall(`Project-${this.projectId}`)
      } else if ( contact.for_what_user === 'client_or_end_user') {
        this.actionToInAppCall(contact.related_account)
      }
    } else if (contact.can_call_with === 'both') {
      this.dataSelect = {
        name: contact.name,
        contact_number: contact.mobile_number,
        is_add: contact.is_add,
        can_call_with: contact.can_call_with,
        for_what_user: contact.for_what_user,
        related_account: contact.related_account,
        image: contact.image,
        id: contact.id,
        is_whatsapp: contact.is_whatsapp,
      }
      this.isModalDetailPhone = true
      console.log("data select for both (in app call and phone dial true", this.dataSelect);
    }
    if (this.isModalDetailPhone) {
        this.layerBack()
    }
  }

  actionToPhoneDial(phoneNumber: any) {
    if (this.isModalDetailPhone === true) {
      this.closeModal();
    }
    window.open(`tel:${phoneNumber}`, '_system');
  }

  actionOpenWhatsapp(phoneNumber: any) {
    if (this.isModalDetailPhone === true) {
      this.closeModal();
    }
    
    const url = `https://wa.me/${phoneNumber}`;
    window.open(url, "_blank");
  }

  async actionToInAppCall(id: any) {
    if (this.isModalDetailPhone === true) {
      this.closeModal();
    }
    console.log(id, typeof id);
    
    if (typeof id === 'string') {
      await this.webRtcService.createOffer(false, id, false, true);
    } else if (typeof id === 'number') {
      await this.webRtcService.createOffer(false, id, false, false);
    }
  }

  layerBack() {
    if (!this.pushedModalState) {
      history.pushState(null, '', location.href);
      this.pushedModalState = true;
    }
  
    const closeModalOnBack = () => {
      this.pushedModalState = false
      this.isModalDetailPhone = false
      window.removeEventListener('popstate', closeModalOnBack);
    };
    window.addEventListener('popstate', closeModalOnBack);
  }

  closeModal() {
    this.isModalDetailPhone = false
    if (this.pushedModalState) {
      this.pushedModalState = false;
      history.back(); // simulate the back button
    }
  
  }
}
