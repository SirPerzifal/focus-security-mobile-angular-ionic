import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { VisitorService } from 'src/app/service/resident/visitor/visitor.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-history-details',
  templateUrl: './history-details.page.html',
  styleUrls: ['./history-details.page.scss'],
})
export class HistoryDetailsPage implements OnInit {

  isModalReasonBanOpen: boolean = false;
  selectedFileName: string = ''; // New property to hold the selected file name

  historyData!: {
    purpose: 'Drop Off' | 'Pick Up' | 'Visiting' | 'Delivery' | string;
    visitor_name: string;
    visitor_date: Date;
    visitor_entry_time: string;
    visitor_exit_time: string;
    mode_of_entry: string;
    vehicle_number: string;
    point_of_entry: string;
    mobile_number: string;
    delivery_type: string;
    vehicle_type: string;
    banned: boolean;
    id: number;
  };

  formData = {
    reason: '',
    block_id: 0,
    unit_id: 0,
    contact_no: '',
    vehicle_no: '',
    visitor_name: '',
    last_entry_date_time: '', 
    image: '',
  }

  constructor(private router: Router, private alertController: AlertController, private visitorService: VisitorService, private toastController: ToastController) { 
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { historyData: any };
    if (state) {
      this.historyData = state.historyData;
      if (this.historyData) {
        const visitorDate = new Date(state.historyData.visitor_date); // Ensure this is a Date object
        const visitorEntryTime = state.historyData.visitor_entry_time; // HH:mm format
        this.formData = {
          reason: '',
          block_id: 1,
          unit_id: 1,
          contact_no: String(this.historyData.mobile_number),
          vehicle_no: String(this.historyData.vehicle_number),
          visitor_name: String(this.historyData.visitor_name),
          last_entry_date_time: this.formatDateTime(visitorDate, visitorEntryTime), 
          image: '',
        }
      }
      console.log(this.historyData);
    }
  }

  toggleShowInv() {
    this.router.navigate(['resident-visitors']);
  }

  toggleShowHired() {
    this.router.navigate(['hired-car']);
  }

  toggleShowHistory() {
    // this.router.navigate(['']);
  }

  ngOnInit() {
    console.log('tes');
    
  }

  public async showAlertButtons(headerName: string, className: string) {
    const alertButtons = await this.alertController.create({
      cssClass: className,
      header: headerName + " this visitor?",
      buttons: [
        {
          text: 'Confirm',
          role: 'confirm',
          handler: () => {
            if (headerName === 'Reinstate') {
              this.reinstateProcess();
            } else if (headerName === 'Ban') {
              this.banProcess();
            }
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Alert cancel');
          },
        },
      ]
    });
    await alertButtons.present ();
  }

  onFileChange(value: any): void {
    let data = value.target.files[0];
    if (data) {
      this.selectedFileName = data.name; // Store the selected file name
      this.convertToBase64(data).then((base64: string) => {
        console.log('Base64 successed');
        this.formData.image = base64.split(',')[1]; // Update the form control for image file
      }).catch(error => {
        console.error('Error converting to base64', error);
      });
    } else {
      this.selectedFileName = ''; // Reset if no file is selected
    }
  }

  banProcess() {
    this.isModalReasonBanOpen = true;
  }

  reinstateProcess() {
    console.log("tes");
    this.visitorService.postReinstate(
      this.formData.block_id,
      this.formData.unit_id,
      this.formData.contact_no,
      this.formData.vehicle_no
    ).subscribe(
      (response) => {
        console.log('Success:', response);
        this.router.navigate(['history']);
      },
    )
  }

  onSubmitReasonBan() {

    if (!this.formData.reason) {
      this.presentToast('Please provide reason why you ban this visitor', 'danger');
      return;
    }

    this.isModalReasonBanOpen = false;
    console.log(this.formData);
    this.visitorService.postBanVisitor(
      this.formData.reason,
      this.formData.block_id,
      this.formData.unit_id,
      this.formData.contact_no,
      this.formData.vehicle_no,
      this.formData.visitor_name,
      this.formData.last_entry_date_time,
      this.formData.image
    ).subscribe(
      (response) => {
        console.log('Success:', response);
        this.router.navigate(['history']);
      },
    )
  }

  setResult() {
    console.log(`Dismissed with role`);
  }

  formatDateTime(date: Date, time: string): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day} ${time}`;
  }

  convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  }

  private routerSubscription!: Subscription;
  OnDestroy() {
    // Bersihkan subscription untuk menghindari memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      color: color
    });
    toast.present();
  }
}