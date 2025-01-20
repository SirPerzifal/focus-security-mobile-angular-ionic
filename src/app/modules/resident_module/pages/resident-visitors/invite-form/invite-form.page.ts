import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { faAddressBook, faL, faMotorcycle, faUser } from '@fortawesome/free-solid-svg-icons';
import { ToastController, AlertController } from '@ionic/angular';
import { VisitorService } from 'src/app/service/resident/visitor/visitor.service';
import { Contacts } from '@capacitor-community/contacts';

interface Invitee {
  visitor_name: string;
  vehicle_number: string;
  contact_number: string;
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
  inviteeFormList: any = [];
  addInviteeText: string = 'Add Invitee';
  isModalOpen: boolean = false; // Status modal
  isFormInitialized: boolean = false;
  isFormVisible: boolean = false; // New variable to control form visibility

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

  nameFromContact = '';
  phoneFromContact = '';

  faAddressBook = faAddressBook
  currentInviteeIndex: number | null = null; // Track the index of the invitee being edited

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private residentVisitorService: VisitorService,
    private toastController: ToastController,
    private alertController: AlertController,
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { formData: FormData, selectedInvitees: Invitee[] };
  
    if (state) {
      this.formData = state.formData;
  
      if (state.selectedInvitees) {
        this.inviteeFormList = state.selectedInvitees; // Update local list
        this.isFormVisible = true; // Show form if there are invitees
        this.addInviteeText = 'Add More Invitees'; // Update button text
        console.log('tes110', state.selectedInvitees)
      }
      console.log('tes1', this.formData);
    }
  }

  backToVisitors() {
    this.router.navigate(['resident-visitors'], {
      state: {
        formData: this.formData,
      }
    });
  }

  async fetchContacts() {
    const result = await Contacts.pickContact({
      projection: {
        name: true,
        phones: true
      }
    });
  
    if (result && result.contact) {
      const contactName = result.contact.name;
      const displayName = contactName?.display || '';
      const givenName = contactName?.given || '';
  
      // Format the name as display_name(given_name)
      const nameFromContact = `${displayName}(${givenName})`.trim();
      const phoneFromContact = result.contact.phones?.[0].number || '';
  
      if (this.currentInviteeIndex !== null) {
        // Populate the fields of the currently selected invitee
        this.inviteeFormList[this.currentInviteeIndex].visitor_name = nameFromContact;
        this.inviteeFormList[this.currentInviteeIndex].contact_number = phoneFromContact;
      } else {
        // If no invitee is selected, create a new one
        const newInvitee: Invitee = {
          visitor_name: nameFromContact,
          contact_number: phoneFromContact,
          vehicle_number: '' // Set this as needed
        };
        this.inviteeFormList.push(newInvitee);
      }
  
      this.isFormVisible = true; // Show form if there are invitees
      this.addInviteeText = 'Add More Invitees'; // Update button text
    }
  }

  faUser = faUser

  showTimeInfo() {
    this.isModalOpen = true; // Membuka modal
  }

  ngOnInit() {
    this.isFormInitialized = false;
    // Gunakan setTimeout untuk memastikan rendering
    this.route.queryParams.subscribe(params => {
      this.initializeInviteeForm(params);
    });
    console.log('tes111', this.isFormInitialized)
    console.log('tes110', this.inviteeFormList)
  }

  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      color: color
    });
    toast.present().then(() => {
    });;
  }

  removeInvitee(index: number) {
    this.inviteeFormList.splice(index, 1); // Menghapus invitee dari list
    if (this.inviteeFormList.length === 0) {
      this.isFormVisible = false; // Sembunyikan form jika tidak ada invitee
    }
  }

  public async presentCustomAlert(
    index: number,
    header: string = 'Remove this form?', 
    confirmText: string = 'Confirm',
    cancelText: string = 'Cancel',
  ) {
    const alert = await this.alertController.create({
      cssClass: 'custom-alert-class-resident-visitors-page',
      header: header,
      message: 'Are you sure you want to remove this invitee?', 
      buttons: [
        {
          text: confirmText,
          cssClass: 'confirm-button',
          handler: () => {
            console.log('Confirmed');
            this.removeInvitee(index); // Panggil metode untuk menghapus invitee
          }
        },
        {
          text: cancelText,
          cssClass: 'cancel-button',
          handler: () => {
            console.log('Canceled');
            // Logika pembatalan (jika ada)
          }
        },
      ]
    });
  
    await alert.present();
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
        visitor_name: invitee.visitor_name || '',
        contact_number: invitee.contact_number || '',
        vehicle_number: invitee.vehicle_number || ''
      }));
      this.addInviteeText = 'Add More Invitees';
    }

    // Jika tidak ada data, tambahkan form kosong
    if (this.inviteeFormList.length > 0) {
      this.isFormVisible = true; // Show form if there are invitees
    }

    // Tandai form sudah diinisialisasi
    this.isFormInitialized = true;
  }

  addInvitee() {
    const newInvitee: Invitee = { 
      visitor_name: '', 
      contact_number: '', 
      vehicle_number: '' 
    };
    
    this.inviteeFormList.push(newInvitee);
    this.addInviteeText = 'Add More Invitees';
    this.isFormVisible = true; // Show form when an invitee is added
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
        openActive: true,
      }
    });
  }

  onSubmit() {
    const isValid = this.inviteeFormList.every((invitee:any) => 
      invitee.visitor_name.trim() !== '' && 
      invitee.contact_number.trim() !== ''
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
              console.log("HEY PEOPLES")
              this.inviteeFormList = [];
              this.inviteeFormList = null;
              this.formData = {
                dateOfInvite: new Date(),
                vehicleNumber: "",
                entryType: "",
                entryTitle: "",
                entryMessage: "",
                isProvideUnit: false,
                hiredCar: "",
                unit: 0,
              }
              this.router.navigate(['/resident-visitors'], {
                queryParams: {
                  openActive: true,
                  formData: null
                }
              });
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

  // Control rendering form
  shouldShowForm(): boolean {
    return this.isFormVisible; // Use the new variable to control visibility
  }
}