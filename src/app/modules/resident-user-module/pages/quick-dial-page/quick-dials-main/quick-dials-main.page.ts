import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

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

  selectedQuickDial: QuickDial | null = null;
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
      icon : dial.image_profile,
    }));
    if (this.quickDials) {
      this.isLoading = false;
    }
    // // console.log(this.quickDials);
  })
 }

  selectQuickDial(dial: QuickDial) {
    if (this.selectedQuickDial === dial) {
      // If the same dial is clicked, close the popup
      this.closePopup(dial.number);
    } else {
      // If a different dial is clicked, animate the popdown first
      this.isAnimating = true;
      setTimeout(() => {
        this.selectedQuickDial = dial;
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
      this.selectedQuickDial = null;
      this.isAnimating = false;
    }, 300); // Match this duration with the CSS animation duration
  }

  async startCall(record:any){
    // await this.webRtcService.startLocalStream();
    record.isResident = true;
    record.requestor_contact_number = record.number;
    await this.webRtcService.createOffer(record);
    // this.router.navigate(['/outgoing-call']);
  }
}
