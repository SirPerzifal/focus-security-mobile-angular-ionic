import { Component, OnInit } from '@angular/core';
import { ServiceProvidersService } from 'src/app/service/resident/service-providers/service-providers.service';
import { ToastController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { ApiService } from 'src/app/service/api.service';
import { WebRtcService } from 'src/app/service/fs-web-rtc/web-rtc.service';

interface QuickDial {
  name: string;
  number: string;
  icon:string;
  is_whatsapp: boolean;
}

@Component({
  selector: 'app-resident-find-a-service-provider',
  templateUrl: './resident-find-a-service-provider.page.html',
  styleUrls: ['./resident-find-a-service-provider.page.scss'],
})
export class ResidentFindAServiceProviderPage implements OnInit {
  quickDials: QuickDial[] = [];

  selectedQuickDial: QuickDial | null = null;
  isAnimating: boolean = false;
  isLoading: boolean = true;
  
  constructor(
    private serviceProvidersService: ServiceProvidersService,
    private toastController: ToastController,
    private apiservice:ApiService,
    private webRtcService: WebRtcService
    
  ) { }

  ngOnInit() {
    Preferences.get({key: 'USESTATE_DATA'}).then(async (value) => {
      if (value?.value) {
        const parseValue = JSON.parse(value.value);
        this.loadServiceProviders(parseValue.project_id)
      }
    })
  }

  loadServiceProviders(project_id:string) {
    this.serviceProvidersService.getServiceProviders(project_id)
      .subscribe({next: (response: any) => {
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
      },
      error: (error) => {
        this.presentToast('Error loading service providers data', 'danger');
        console.error('Error:', error);
      }
    });
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

  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color
    });
    
    const pingSound = new Audio('assets/sound/Ping Alert.mp3');
    const errorSound = new Audio('assets/sound/Error Alert.mp3');

    toast.present().then(() => {
      if (color === 'success') {
        pingSound.play().catch((err) => console.error('Error playing sound:', err));
      } else {
        errorSound.play().catch((err) => console.error('Error playing sound:', err));
      }
    });
  }

  async startCall(record:any){
    record.isResident = true;
    record.requestor_contact_number = record.number;
    // await this.webRtcService.createOffer(record);
  }

  openWhatsApp() {
    const message = encodeURIComponent("Hello!");
    const url = `https://wa.me/${this.selectedQuickDial?.number}?text=${message}`;
    window.open(url, "_blank");
  }
}