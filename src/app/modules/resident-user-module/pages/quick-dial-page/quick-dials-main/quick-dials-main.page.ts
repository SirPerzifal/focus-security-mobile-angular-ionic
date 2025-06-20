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

  selectedQuickDialParam: QuickDial | null = null;
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

 loadQuickDials() {
  this.mainApiResidentService.endpointProcess({project_id: String(this.projectId)}, 'get/contact_list').subscribe((result: any) => {
    // // console.log(result);
    this.quickDials = result.result.response_result.map((dial: any) => ({
      id : dial.id,
      name : dial.name,
      number : dial.contact_number,
      is_allow_resident_quick_dials : dial.is_allow_resident_quick_dials,
      is_allow_whatsapp : dial.is_allow_whatsapp,
      icon : dial.image_profile,
    }));
    if (this.quickDials) {
      console.log(this.quickDials);
      
      this.isLoading = false;
    }
    // // console.log(this.quickDials);
  })
 }

  selectQuickDial(dial: QuickDial) {
    console.log(dial);
    
    if (this.selectedQuickDialParam === dial) {
      console.log("selectedQuickDial", this.selectedQuickDialParam);
      
      // If the same dial is clicked, close the popup
      this.closePopup(dial.number);
    } else {
      // If a different dial is clicked, animate the popdown first
      this.isAnimating = true;
      setTimeout(() => {
        this.selectedQuickDialParam = dial;
        console.log("selectedQuickDial", this.selectedQuickDialParam);
        this.isAnimating = false;
      }, 300); // Match this duration with the CSS animation duration
    }
  }

  closePopup(phoneNumber?: string) {
    if (phoneNumber) {
      window.open(`tel:${phoneNumber}`, '_system');
    }
    this.isAnimating = true;
    setTimeout(() => {
      this.selectedQuickDialParam = null;
      this.isAnimating = false;
    }, 300); // Match this duration with the CSS animation duration
  }

  async startCall(record:any){
    await this.webRtcService.createOffer(false, record.number, false, true);
  }

  openWhatsApp(phoneNumber: string) {
    const message = encodeURIComponent("Hello!");
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(url, "_blank");
    this.closePopup()
  }
}
