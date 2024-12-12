import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { faL } from '@fortawesome/free-solid-svg-icons';
import { ToastController } from '@ionic/angular';
import { VisitorService } from 'src/app/service/resident/visitor/visitor.service';

interface Invitee {
  name: string;
  mobile_number: string;
  car_number: string;
}

interface FormData {
  dateOfInvite: Date;
  vehicleNumber: string;
  entryType: string;
  entryTitle: string;
  entryMessage: string;
  isProvideUnit: boolean;
  hiredCar: string;
  unit: number;
}


@Component({
  selector: 'app-invite-form',
  templateUrl: './invite-form.page.html',
  styleUrls: ['./invite-form.page.scss'],
})
export class InviteFormPage implements OnInit {
  inviteeFormList: Invitee[] = [];
  addInviteeText: string = 'Add Invitee';
  isFormInitialized: boolean = false;

  formData = {
    dateOfInvite: new Date(),
    vehicleNumber: "",
    entryType: "",
    entryTitle: "",
    entryMessage: "",
    isProvideUnit: false,
    hiredCar: "",
    unit: 0,
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private residentVisitorService: VisitorService,
    private toastController: ToastController
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { formData: FormData };
    if (state) {
      this.formData = state.formData;
      console.log(this.formData)
    }
  }

  ngOnInit() {
    this.isFormInitialized = false;
    // Gunakan setTimeout untuk memastikan rendering
    this.route.queryParams.subscribe(params => {
      this.initializeInviteeForm(params);
    });
    console.log(this.isFormInitialized)
    console.log(this.inviteeFormList)
  }

  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      color: color
    });

    
    const pingSound = new Audio('assets/sound/Ping Alert.mp3');
    const errorSound = new Audio('assets/sound/Error Alert.mp3');

    toast.present().then(() => {
      
      
    });;
  }

  initializeInviteeForm(params?: any) {
    // Cek state dari navigasi saat ini
    const navigation = this.router.getCurrentNavigation();
    const navigationState = navigation?.extras.state;

    // Cek state dari route
    let selectedInvitees: any[] = [];

    // Prioritaskan state dari navigasi
    if (navigationState && navigationState['selectedInvitees']) {
      selectedInvitees = navigationState['selectedInvitees'];
    } 
    // Jika tidak ada, cek params
    else if (params && params['selectedInvitees']) {
      try {
        selectedInvitees = JSON.parse(params['selectedInvitees']);
      } catch (error) {
        console.error('Error parsing selectedInvitees', error);
      }
    }

    // Proses data invitee
    if (selectedInvitees && selectedInvitees.length > 0) {
      this.inviteeFormList = selectedInvitees.map((invitee: any) => ({
        name: invitee.name || '',
        mobile_number: invitee.mobile_number || '',
        car_number: invitee.car_number || ''
      }));
      this.addInviteeText = 'Add More Invitees';
    }

    // Jika tidak ada data, tambahkan form kosong
    if (this.inviteeFormList.length === 0) {
      this.addInvitee();
    }

    // Tandai form sudah diinisialisasi
    this.isFormInitialized = true;
  }

  addInvitee() {
    const newInvitee: Invitee = { 
      name: '', 
      mobile_number: '', 
      car_number: '' 
    };
    
    this.inviteeFormList.push(newInvitee);
    this.addInviteeText = 'Add More Invitees';
  }

  navigateToInviteFormHistory() {
    // Kirim data yang sudah diisi ke halaman invite-form-history
    this.router.navigate(['/invite-from-history'], { 
      state: { existingInvitees: this.inviteeFormList } 
    });
  }

  backWithState() {
    this.router.navigate(['/resident-visitors'], {
      state: {
        formData: this.formData,
      }
    });
  }

  onSubmit() {
    const isValid = this.inviteeFormList.every(invitee => 
      invitee.name.trim() !== '' && 
      invitee.mobile_number.trim() !== '' && 
      invitee.car_number.trim() !== ''
    );

    if (isValid) {
      console.log('Submitting Invitees:', this.inviteeFormList);
      try {
        this.residentVisitorService.postCreateExpectedVisitors(
          this.formData.dateOfInvite,
          this.formData.entryType,
          this.formData.entryTitle,
          this.formData.entryMessage,
          this.formData.isProvideUnit,
          this.inviteeFormList,
          this.formData.hiredCar,
          this.formData.unit,
        ).subscribe(
          res => {
            console.log(res);
            // if (res.result.status_code == 200) {
              
              this.presentToast('Success Add Record', 'success');
              this.router.navigate(['resident-visitors'])
            // } else {
            //   this.presentToast('Failed Add Record', 'danger');
            // }
          },
          error => {
            console.error('Error:', error);
          }
        );
      } catch (error) {
        console.error('Unexpected error:', error);
        this.presentToast(String(error), 'danger');
      }
    } else {
      this.presentToast('Please fill all needed field.', 'danger');
    }
  }

  // Kontrol rendering form
  shouldShowForm(): boolean {
    return this.isFormInitialized && this.inviteeFormList.length > 0;
  }
}