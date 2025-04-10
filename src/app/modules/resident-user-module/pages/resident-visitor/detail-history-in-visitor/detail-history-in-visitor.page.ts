import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ToastController } from '@ionic/angular';

import { StorageService } from 'src/app/service/storage/storage.service';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { Estate } from 'src/models/resident/resident.model';

@Component({
  selector: 'app-detail-history-in-visitor',
  templateUrl: './detail-history-in-visitor.page.html',
  styleUrls: ['./detail-history-in-visitor.page.scss'],
})
export class DetailHistoryInVisitorPage implements OnInit, OnDestroy {

  isModalReasonBanOpen: boolean = false;
  selectedFileName: string = ''; // New property to hold the selected file name

  minDate: string = this.getTodayDate(); // Set tanggal minimum saat inisialisasi
  formattedDate: string = '';
  isModalReinviteOpen: boolean = false; // New property to hold the
  dataForReinvite = {
    visitor_id: 0,
    family_id: 0,
    date_of_visit: '',
    entry_type: '',
    entry_title: '',
    entry_message: '',
    is_provide_unit: false,
  }

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
  projectId: number = 0;

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

  constructor(private router: Router, private alertController: AlertController, private toastController: ToastController, private mainApiResidentService: MainApiResidentService, private storage: StorageService) { 
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { historyData: any };
    if (state) {
      this.historyData = state.historyData;
      if (this.historyData) {
        const visitorDate = new Date(state.historyData.visitor_date); // Ensure this is a Date object
        const visitorEntryTime = state.historyData.visitor_entry_time; // HH:mm format
        this.formData = {
          reason: '',
          block_id: 0,
          unit_id: 0,
          contact_no: String(this.historyData.mobile_number),
          vehicle_no: String(this.historyData.vehicle_number),
          visitor_name: String(this.historyData.visitor_name),
          last_entry_date_time: this.formatDateTime(visitorDate, visitorEntryTime), 
          image: '',
        }
      }
    }
  }

  ngOnInit() {
    this.storage.getValueFromStorage('USESATE_DATA').then((value: any) => {
      if ( value ) {
        this.storage.decodeData(value).then((value: any) => {
          if ( value ) {
            const estate = JSON.parse(value) as Estate;
            this.formData.unit_id = estate.unit_id;
            this.formData.block_id = estate.block_id;
            this.dataForReinvite.family_id = estate.family_id;
            this.projectId = estate.project_id;
          }
        })
      } 
    })
  }

  getTodayDate(): string {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Bulan mulai dari 0
    const yyyy = today.getFullYear();
    return `${dd}-${mm}-${yyyy}`; // Format yyyy-mm-dd
  }

  toggleShowHistory() {
    this.router.navigate(['history-in-visitor'], );
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
            // console.log('Alert cancel');
          },
        },
      ]
    });
    await alertButtons.present ();
  }

  banProcess() {
    this.isModalReasonBanOpen = true;
  }

  reinstateProcess() {
    // console.log("tes");
    this.mainApiResidentService.endpointProcess({
      block_id: this.formData.block_id,
      unit_id: this.formData.unit_id,
      contact_no: this.formData.contact_no,
      vehicle_number: this.formData.vehicle_no
    }, 'post/reinstate_visitor').subscribe((response) => {
      this.router.navigate(['history-in-visitor'], );
    })
  }

  onSubmitReasonBan() {
    if (!this.formData.reason) {
      this.presentToast('Please provide reason why you ban this visitor', 'danger');
      return;
    }
    this.isModalReasonBanOpen = false;
    // console.log(this.formData);
    this.mainApiResidentService.endpointProcess({
      reason: this.formData.reason,
      block_id: this.formData.block_id,
      project_id: this.projectId,
      unit_id: this.formData.unit_id,
      contact_no: this.formData.contact_no,
      vehicle_no: this.formData.vehicle_no,
      visitor_name: this.formData.visitor_name,
      last_entry_date_time: this.formData.last_entry_date_time, 
      image: this.formData.image,
    }, 'post/ban_visitor').subscribe((response) => {
      this.router.navigate(['history-in-visitor'], );
    })
  }

  formatDateTime(date: Date, time: string): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day} ${time}`;
  }

  onFileChange(value: any): void {
    let data = value.target.files[0];
    if (data) {
      this.selectedFileName = data.name; // Store the selected file name
      this.convertToBase64(data).then((base64: string) => {
        // console.log('Base64 successed');
        this.formData.image = base64.split(',')[1]; // Update the form control for image file
      }).catch(error => {
        console.error('Error converting to base64', error);
      });
    } else {
      this.selectedFileName = ''; // Reset if no file is selected
    }
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

  reinviteModal(invite: any) {
    this.isModalReinviteOpen = !this.isModalReinviteOpen;
    this.dataForReinvite.visitor_id = invite.id;
  }

  onEntryTypeChange(value: string): void {
    this.dataForReinvite.entry_type = this.dataForReinvite.entry_type === value ? '' : value;
  }

  onProvideUnitChange() {
    this.dataForReinvite.is_provide_unit = !this.dataForReinvite.is_provide_unit;
  }

  onDateOfInviteChange(event: Event) {
    const input = event.target as HTMLInputElement; // Ambil elemen input
    this.dataForReinvite.date_of_visit = input.value; // Ambil nilai dari input
    this.formattedDate = input.value; // Ambil
    // console.log(this.formattedDate, this.formData.dateOfInvite)
  }

  entryTitleChange(value: string) {
    this.dataForReinvite.entry_title = value;
  }

  onSubmitNext() {
    let errMsg = '';
    if (this.dataForReinvite.date_of_visit == '') {
      errMsg += 'Please fill date of invite! \n';
    }
    if (this.dataForReinvite.entry_type == "") {
      errMsg += "Please choose entry type! \n";
    }
    if (this.dataForReinvite.entry_title == "") {
      errMsg += "Please fill entry title! \n";
    }
    
    if (errMsg == '') {
      this.isModalReinviteOpen = !this.isModalReinviteOpen;
      this.mainApiResidentService.endpointProcess({
        visitor_id: this.dataForReinvite.visitor_id,
        family_id: this.dataForReinvite.family_id,
        date_of_visit: this.dataForReinvite.date_of_visit,
        entry_type: this.dataForReinvite.entry_type,
        entry_title: this.dataForReinvite.entry_title,
        entry_message: this.dataForReinvite.entry_message,
        is_provide_unit: this.dataForReinvite.is_provide_unit,
      }, 'post/reinvite_visitor').subscribe((response) => {
        this.router.navigate(['/resident-visitors'], {
          queryParams: {
            openActive: true,
            formData: null
          }
        });
      })
    } else {
      this.presentToast(errMsg, 'danger');
    }
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
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
