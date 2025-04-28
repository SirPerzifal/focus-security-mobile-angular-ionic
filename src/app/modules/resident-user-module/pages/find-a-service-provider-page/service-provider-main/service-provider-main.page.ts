import { Component, OnInit } from '@angular/core';

import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { ApiService } from 'src/app/service/api.service';
import { WebRtcService } from 'src/app/service/fs-web-rtc/web-rtc.service';

interface QuickDial {
  name: string;
  number: string;
  icon:string;
  is_whatsapp: boolean;
}

@Component({
  selector: 'app-service-provider-main',
  templateUrl: './service-provider-main.page.html',
  styleUrls: ['./service-provider-main.page.scss'],
})
export class ServiceProviderMainPage implements OnInit {
  quickDials: QuickDial[] = [];

  selectedQuickDial: QuickDial | null = null;
  isAnimating: boolean = false;
  isLoading: boolean = true;
  
  constructor(
    private apiservice:ApiService,
    private webRtcService: WebRtcService,
    private mainApi: MainApiResidentService
  ) { }

  ngOnInit() {
    this.loadServiceProviders();
  }

  loadServiceProviders() {
    this.mainApi.endpointMainProcess({}, 'get/service/providers').subscribe((response: any) => {
      if (response.result.status_code === 200) {
        // Map data dengan tipe yang jelas
        this.quickDials = response.result.data.map((service: any) => ({
          name: service.name,
          number: service.contact_number,
          icon:`${this.apiservice.baseUrl}/web/image/fs.residential.service.providers/${service.id}/icon`,
          is_whatsapp: service.is_whatsapp
        }));
        if (this.quickDials) {
          this.isLoading = false;
        }
        // console.log('Mapped Service Providers:', this.quickDials);
        // console.log('Mapped Service Providers:', response);
      } else {
          this.isLoading = false;
          console.error('Error:', response);
      }
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
    await this.webRtcService.createOffer(false, record.number, false, true);
  }

  openWhatsApp() {
    const message = encodeURIComponent("Hello!");
    const url = `https://wa.me/${this.selectedQuickDial?.number}?text=${message}`;
    window.open(url, "_blank");
  }
}
