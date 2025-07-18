import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-detail-history-in-commercial',
  templateUrl: './detail-history-in-commercial.page.html',
  styleUrls: ['./detail-history-in-commercial.page.scss'],
})
export class DetailHistoryInCommercialPage implements OnInit, OnDestroy {


  isModalReasonBanOpen: boolean = false;
  selectedFileName: string = ''; // New property to hold the selected file name
  isAnimating: boolean = false;
  selectedQuickDial: any | null = null;

  minDate: string = this.getTodayDate(); // Set tanggal minimum saat inisialisasi
  formattedDate: string = '';
  isModalReinviteOpen: boolean = false; // New property to hold the
  dataForReinvite = {
    visitor_id: 0,
    date_of_visit: '',
    entry_type: '',
    entry_title: '',
    entry_message: '',
    // is_provide_unit: false,
  }

  historyData!: {
    company_name: string
    purpose: string;
    visitor_name: string;
    visitor_date: Date;
    inviting_date: Date;
    entry_full_date: string;
    visitor_entry_time: string;
    visitor_exit_time: string;
    mode_of_entry: string;
    vehicle_number: string;
    point_of_entry: string;
    mobile_number: string;
    banned: boolean;
    id: number;
    identification_number: string;
    identification_type: string;
    sub_contractor_ids: []
  };

  formData = {
    reason: '',
    contact_no: '',
    vehicle_no: '',
    visitor_name: '',
    last_entry_date_time: '', 
    image: '',
  }

  constructor(private router: Router, private alertController: AlertController, private mainApiResidentService: MainApiResidentService, public functionMain: FunctionMainService) { 
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { historyData: any };
    if (state) {
      this.historyData = state.historyData;
      if (this.historyData) {
        console.log(this.historyData);
        
        const visitorDate = new Date(state.historyData.visitor_date); // Ensure this is a Date object
        const visitorEntryTime = state.historyData.visitor_entry_time; // HH:mm format
        this.formData = {
          reason: '',
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
  }

  getTodayDate(): string {
    const today = new Date();
    const string = today.toString;
    const final = String(today);
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Bulan mulai dari 0
    const yyyy = today.getFullYear();
    return `${yyyy}-${mm}-${dd}`; // Format yyyy-mm-dd
  }

  toggleShowHistory() {
    this.router.navigate(['history']);
  }

  public async showAlertButtons(headerName: string, className: string) {
    const alertButtons = await this.alertController.create({
      cssClass: className,
      header: headerName + " this contractor?",
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

  onSubmitReasonBan() {
    if (!this.formData.reason) {
      this.functionMain.presentToast('Please provide reason why you ban this contractor', 'danger');
      return;
    }
    this.isModalReasonBanOpen = false;
    // console.log(this.formData);
    this.mainApiResidentService.endpointMainProcess({
      reason: this.formData.reason,
      contact_no: this.formData.contact_no,
      vehicle_no: this.formData.vehicle_no,
      visitor_name: this.formData.visitor_name,
      last_entry_date_time: this.formData.last_entry_date_time, 
      image: this.formData.image,
    }, 'post/ban_visitor').subscribe((response) => {
      this.router.navigate(['history-in-contractor']);
    })
  }

  reinstateProcess() {
    // console.log("tes");
    this.mainApiResidentService.endpointMainProcess({
      contact_no: this.formData.contact_no,
      vehicle_number: this.formData.vehicle_no
    }, 'post/reinstate_visitor').subscribe((response) => {
      this.router.navigate(['history-in-contractor']);
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
      this.functionMain.convertToBase64(data).then((base64: string) => {
        // console.log('Base64 successed');
        this.formData.image = base64.split(',')[1]; // Update the form control for image file
      }).catch(error => {
        console.error('Error converting to base64', error);
      });
    } else {
      this.selectedFileName = ''; // Reset if no file is selected
    }
  }

  reinviteModal(invite: any) {
    console.log(invite);
    
    this.isModalReinviteOpen = !this.isModalReinviteOpen;
    this.dataForReinvite.visitor_id = invite.id;
  }

  onDateOfInviteChange(event: any) {
    this.dataForReinvite.date_of_visit = event; // Ambil nilai dari input
    this.formattedDate = this.functionMain.formatDate((event)); // Ambil
    // console.log(this.formattedDate, this.formData.dateOfInvite)
  }

  onEntryTypeChange(value: any): void {
    console.log(value);
    
    if (value.click === true) {
      this.dataForReinvite.entry_type = value.value;
    } else if (value.click === false) {
      this.dataForReinvite.entry_type = '';
    }
  }

  // onProvideUnitChange(event: any) {
  //   this.dataForReinvite.is_provide_unit = !this.dataForReinvite.is_provide_unit;
  // }

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
      this.mainApiResidentService.endpointMainProcess({
        contractor_id: this.dataForReinvite.visitor_id,
        date_of_visit: this.dataForReinvite.date_of_visit,
        entry_type: this.dataForReinvite.entry_type,
        entry_title: this.dataForReinvite.entry_title,
        entry_message: this.dataForReinvite.entry_message,
        // is_provide_unit: this.dataForReinvite.is_provide_unit,
      }, 'post/contractor_reinvite_visitor').subscribe((response) => {
        if (response.result.response_status === 400) {
          this.functionMain.presentToast(response.result.response_description, 'danger');
          this.isModalReinviteOpen = false;
          this.formattedDate = '';
          this.dataForReinvite = {
            visitor_id: 0,
            date_of_visit: '',
            entry_type: '',
            entry_title: '',
            entry_message: '',
            // is_provide_unit: false,
          }
        } else {
          this.functionMain.presentToast('Success reinvite the con.', 'success');
          this.router.navigate(['/contractor-commercial-main'], {
            queryParams: {
              openActive: true,
              formData: null
            }
          });
        }
      })
    } else {
      this.functionMain.presentToast(errMsg, 'danger');
    }
  }

  selectQuickDial(dial: any) {
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

  openWhatsApp(phoneNumber?: string) {
    const message = encodeURIComponent("Hello!");
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(url, "_blank");
    this.closePopup()
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    // Bersihkan subscription untuk menghindari memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  backToPrevPage() {
    this.router.navigate(['/history-in-contractor'])
  }

}
