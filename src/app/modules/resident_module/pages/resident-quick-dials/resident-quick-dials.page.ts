import { Component, numberAttribute, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Router } from '@angular/router';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { QuickDial } from 'src/models/resident/quickDials.model';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { WebRtcService } from 'src/app/service/fs-web-rtc/web-rtc.service';

@Component({
  selector: 'app-resident-quick-dials',
  templateUrl: './resident-quick-dials.page.html',
  styleUrls: ['./resident-quick-dials.page.scss'],
})
export class ResidentQuickDialsPage implements OnInit {
  quickDials: QuickDial[] = [];
  projectId: number = 0;

  selectedQuickDial: QuickDial | null = null;
  isAnimating: boolean = false;

  isLoading: boolean = true;

  constructor(
    // private webRtcService: WebRtcService, 
    private router: Router,
    private mainApiResidentService: MainApiResidentService,
    public functionMain: FunctionMainService,
    private webRtcService: WebRtcService
  ) { }

  ngOnInit() {
    Preferences.get({key: 'USESTATE_DATA'}).then(async (value) => {
      if (value?.value) {
        const parseValue = JSON.parse(value.value);
        this.projectId = parseValue.project_id;
        this.loadQuickDials();
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