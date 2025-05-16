import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { faAddressBook, faUser } from '@fortawesome/free-solid-svg-icons';
import { AlertController } from '@ionic/angular';
import { Contacts } from '@capacitor-community/contacts';

import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { FormData, Invitee } from 'src/models/resident/resident.model';

@Component({
  selector: 'app-visitor-invitig-form',
  templateUrl: './visitor-invitig-form.page.html',
  styleUrls: ['./visitor-invitig-form.page.scss'],
})
export class VisitorInvitigFormPage implements OnInit {

  faUser = faUser
  faAddressBook = faAddressBook
  inviteeFormList: any = [];
  addInviteeText: string = 'Add Invitee';
  isModalOpen: boolean = false; // Status modal
  isFormInitialized: boolean = false;
  isFormVisible: boolean = false; // New variable to control form visibility
  countryCodes: any[] = [
    {
      country: 'SG',
      code: '65',
      digit: 8,
    },
    {
      country: 'ID',
      code: '62',
      digit: 12,
    },
    {
      country: 'MY',
      code: '60',
      digit: 9,
    },
  ]

  formData = {
    dateOfInvite: new Date(),
    vehicleNumber: "",
    entryType: "",
    entryTitle: "",
    entryMessage: "",
    isProvideUnit: false,
    facility: '',
    hiredCar: "",
  }

  nameFromContact = '';
  phoneFromContact = '';

  currentInviteeIndex: number | null = null; // Track the index of the invitee being edited

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private mainApiResidentService: MainApiResidentService,
    public functionMain: FunctionMainService
  ) {
    this.addInitialInvitee();
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { formData: FormData, selectedInvitees: Invitee[] };
  
    if (state) {
        this.formData = {
          ...state.formData,
          dateOfInvite: new Date(state.formData.dateOfInvite) // Ensure this is a Date object
        };
        console.log(state.formData.dateOfInvite);
      if (state.selectedInvitees) {
        this.inviteeFormList = state.selectedInvitees; // Update local list
        this.isFormVisible = true; // Show form if there are invitees
        this.addInviteeText = 'Add More Invitees'; // Update button text
      }
    }
  }

  // Pastikan selectedCountry diinisialisasi dengan benar
  ngOnInit() {
    this.isFormInitialized = false;
    // Jika selectedCountry belum diinisialisasi
    if (!this.selectedCountry || this.selectedCountry.length === 0) {
      this.selectedCountry = [];
    }
    
    // Gunakan setTimeout untuk memastikan rendering
    this.route.queryParams.subscribe(params => {
      this.initializeInviteeForm(params);
    });
  }

  addInitialInvitee() {
    const initialInvitee: Invitee = { 
      visitor_name: '', 
      contact_number: '', 
      vehicle_number: '' 
    };

    const selectedCode: any = { 
      selected_code: '65'
    };

    this.inviteeFormList.push(initialInvitee);
    this.selectedCountry.push(selectedCode)
    this.isFormVisible = true; // Show form since we have at least one invitee
    this.addInviteeText = 'Add More Invitees'; // Update button text
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
      console.log(selectedInvitees);
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
      this.inviteeFormList = selectedInvitees.map((invitee: any) => {
        let contact_number = invitee.contact_number || '';
  
        // Validasi untuk contact_number
        if (contact_number.startsWith('6') && contact_number.length > 2) {
          this.selectedCountry = selectedInvitees.map((invitee: any) => {
            let contact_number = invitee.contact_number || '';
            let selectedCountry = ''
      
            // Validasi untuk contact_number
            if (contact_number.startsWith('6') && contact_number.length > 2) {
              selectedCountry = contact_number.substring(0, 2); // Ambil 2 karakter terdepan
            }
      
            return {
              selected_code: selectedCountry
            };
          });
          console.log(this.selectedCountry);
          
          contact_number = contact_number.substring(2); // Ambil sisa dari contact_number
        }
  
        return {
          visitor_name: invitee.visitor_name || '',
          contact_number: invitee.contact_number, // contact_number yang sudah dipisahkan
          vehicle_number: invitee.vehicle_number || '',
        };
      });
      this.addInviteeText = 'Add More Invitees';
    }
    // Setelah memproses inviteeFormList, pastikan selectedCountry memiliki ukuran yang sama
    while (this.selectedCountry.length < this.inviteeFormList.length) {
      this.selectedCountry.push({ selected_code: '65' });
    }
  
    if (this.inviteeFormList.length > 0) {
      this.isFormVisible = true; // Show form if there are invitees
    }
  
    this.isFormInitialized = true;
  }

  backToVisitors() {
    this.router.navigate(['visitor-main'], {
      state: {
        formData: this.formData,
      }, 
      queryParams: {
        reload: true
      }
    });
  }

  // Perbaikan pada method fetchContacts()
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
        
        // Tambahkan entry baru ke selectedCountry
        this.selectedCountry.push({ selected_code: '65' });
      }

      this.isFormVisible = true; // Show form if there are invitees
      this.addInviteeText = 'Add More Invitees'; // Update button text
    }
  }

  showTimeInfo() {
    this.isModalOpen = true; // Membuka modal
  }

  // Perbaikan pada method removeInvitee()
  removeInvitee(index: number) {
    this.inviteeFormList.splice(index, 1); // Menghapus invitee dari list
    this.selectedCountry.splice(index, 1); // Menghapus selectedCountry yang sesuai
    
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
            // console.log('Confirmed');
            this.removeInvitee(index); // Panggil metode untuk menghapus invitee
          }
        },
        {
          text: cancelText,
          cssClass: 'cancel-button',
          handler: () => {
          }
        },
      ]
    });
  
    await alert.present();
  }

  addInvitee() {
    const newInvitee: Invitee = { 
      visitor_name: '', 
      contact_number: '', 
      vehicle_number: '' 
    };
    
    // Tambahkan invitee baru ke list
    this.inviteeFormList.push(newInvitee);
    
    // Pastikan juga menambahkan item baru ke selectedCountry
    this.selectedCountry.push({ selected_code: '65' });
    
    this.addInviteeText = 'Add More Invitees';
    this.isFormVisible = true;
  }

  selectedCountry: any[] = [];
  onChangeCountryCode(event: any, index: any) {
    this.selectedCountry[index].selected_code = event.target.value;
    this.inviteeFormList.every((invitee:any) => {
      if (invitee.contact_number.trim() !== '' && invitee.contact_number.startsWith('6')) {
        const separatedCode = this.inviteeFormList[index].contact_number.slice(2, 20);
        // this.inviteeFormList[index].contact_number = this.selectedCountry[index].selected_code + separatedCode;
        console.log(this.inviteeFormList[index].contact_number);
      } else {
        // this.inviteeFormList[index].contact_number = this.selectedCountry[index].selected_code + this.inviteeFormList[index].contact_number;
        // console.log(this.selectedCountry + this.inviteeFormList[index].contact_number);
      }
    });
  }

  onChangePhoneNumber(event: any, index: any) {
    if (event.target.value.length < 4) {
      this.functionMain.presentToast('Phone is not minimum character', 'danger')
      return
    } else {
      this.inviteeFormList[index].contact_number = this.selectedCountry[index].selected_code + event.target.value;
    }
  }

  navigateToInviteFormHistory() {
    this.router.navigate(['/visitor-inviting-from-history'], { 
      state: { existingInvitees: this.inviteeFormList } 
    });
  }

  backWithState() {
    this.router.navigate(['/visitor-main'], {
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
      console.log(this.inviteeFormList);
      console.log('this.inviteeFormListthis.inviteeFormListthis.inviteeFormList');
      
      try {
        this.mainApiResidentService.endpointMainProcess({
          date_of_visit: this.formData.dateOfInvite, 
          entry_type: this.formData.entryType, 
          entry_title: this.formData.entryTitle,
          entry_message: this.formData.entryMessage,
          is_provide_unit: this.formData.isProvideUnit ? this.formData.isProvideUnit : false,
          facility: this.formData.facility ? this.formData.facility : 0,
          invitees: this.inviteeFormList,
          hired_car: this.formData.hiredCar,
        }, 'post/create_expected_visitors').subscribe((response: any) => {
          if (response.result.response_code == 200) {
            this.functionMain.presentToast('Success Add Invite', 'success');
            this.inviteeFormList = [];
            this.inviteeFormList = null;
            this.formData = {
              dateOfInvite: new Date(),
              vehicleNumber: "",
              entryType: "",
              entryTitle: "",
              entryMessage: "",
              isProvideUnit: false,
              facility: '',
              hiredCar: "",
            }
            this.router.navigate(['/visitor-main'], {
              queryParams: {
                openActive: true,
                formData: null
              }
            });
          } else {
            this.functionMain.presentToast('Failed Add Invite', 'danger');
          }
        })
      } catch (error) {
        console.error('Unexpected error:', error);
        this.functionMain.presentToast(String(error), 'danger');
      }
    } else {
      this.functionMain.presentToast('Please fill all needed field.', 'danger');
    }
  }

  shouldShowForm(): boolean {
    return this.isFormVisible; // Use the new variable to control visibility
  }
}
