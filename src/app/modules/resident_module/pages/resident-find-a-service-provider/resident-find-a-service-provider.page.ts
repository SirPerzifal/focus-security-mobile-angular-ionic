import { Component, OnInit } from '@angular/core';
import { ServiceProvidersService } from 'src/app/service/resident/service-providers/service-providers.service';
import { ToastController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { ApiService } from 'src/app/service/api.service';

interface QuickDial {
  name: string;
  number: string;
  icon:string;
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
    private apiservice:ApiService
    
  ) { }

  ngOnInit() {
    // // console.log('ngOnInitngOnInitngOnInit');
    
    Preferences.get({key:'ACTIVE_PROJECT'}).then((project_value)=>{
      // // console.log(project_value);
      // // console.log('project_valueproject_valueproject_valueproject_valueproject_valueproject_value');
      
      if(project_value?.value){
        this.loadServiceProviders(project_value?.value)
      }else{
        this.presentToast('Error Project has not been chosen. Please go to the profile estate section and choose a unit', 'danger');
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
            icon:`${this.apiservice.baseUrl}/web/image/fs.residential.service.providers/${service.id}/icon`
          }));
          if (this.quickDials) {
            this.isLoading = false;
          }
          // console.log('Mapped Service Providers:', this.quickDials);
          // console.log('Mapped Service Providers:', response);
        } else {
          this.presentToast('Failed to load booking data', 'danger');
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
}