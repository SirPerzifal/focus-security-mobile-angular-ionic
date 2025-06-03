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
  selectedCountry: any[] = [];

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
      contact_number_display: '', // Tambahkan field untuk display
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
        let contact_number_display = '';
        let country_code = '65';
  
        // Validasi untuk contact_number
        if (contact_number.startsWith('6') && contact_number.length > 2) {
          country_code = contact_number.substring(0, 2); // Ambil 2 karakter terdepan
          contact_number_display = contact_number.substring(2); // Sisa untuk display
        } else {
          contact_number_display = contact_number;
        }
  
        return {
          visitor_name: invitee.visitor_name || '',
          contact_number: contact_number, // Full number dengan country code
          contact_number_display: contact_number_display, // Number tanpa country code untuk display
          vehicle_number: invitee.vehicle_number || '',
        };
      });

      // Set selectedCountry berdasarkan contact number
      this.selectedCountry = selectedInvitees.map((invitee: any) => {
        let contact_number = invitee.contact_number || '';
        let selectedCountry = '65'; // default
  
        // Validasi untuk contact_number
        if (contact_number.startsWith('6') && contact_number.length > 2) {
          selectedCountry = contact_number.substring(0, 2); // Ambil 2 karakter terdepan
        }
  
        return {
          selected_code: selectedCountry
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

      const newPhoneNumber = phoneFromContact.replace(/\D/g, '')

      if (this.currentInviteeIndex !== null) {
        console.log(this.selectedCountry[0]?.selected_code, newPhoneNumber.substring(0, 2), newPhoneNumber, newPhoneNumber.slice(2), newPhoneNumber.startsWith('0'));
        if (newPhoneNumber.startsWith('0')) {
          const readyToInputPhoneNumber = newPhoneNumber.slice(1)
          this.selectedCountry[this.currentInviteeIndex].selected_code = '65'
          this.inviteeFormList[this.currentInviteeIndex].visitor_name = nameFromContact;
          this.inviteeFormList[this.currentInviteeIndex].contact_number_display = readyToInputPhoneNumber;
          this.updateContactNumber(this.currentInviteeIndex);
          console.log(readyToInputPhoneNumber, "dari 0");
        } else if (newPhoneNumber.startsWith('6')) {
          const readyToInputPhoneNumber = newPhoneNumber.slice(2)
          const countryCodeFromContact = newPhoneNumber.substring(0, 2);
          const isValidCountryCode = this.countryCodes.some(code => code.code === countryCodeFromContact);
          if (isValidCountryCode) {
           this.selectedCountry[this.currentInviteeIndex].selected_code = countryCodeFromContact
           console.log(this.selectedCountry[this.currentInviteeIndex].selected_code);
          } else {
           this.selectedCountry[this.currentInviteeIndex].selected_code = '65'
           console.log(this.selectedCountry[this.currentInviteeIndex].selected_code);
          }
          this.inviteeFormList[this.currentInviteeIndex].visitor_name = nameFromContact;
          this.inviteeFormList[this.currentInviteeIndex].contact_number_display = readyToInputPhoneNumber;
          this.updateContactNumber(this.currentInviteeIndex);
          console.log(readyToInputPhoneNumber, "dari 6");
        }
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
    const newInvitee: any = { 
      visitor_name: '', 
      contact_number: '65', // Default dengan country code
      contact_number_display: '', // Kosong untuk display
      vehicle_number: '' 
    };
    
    // Tambahkan invitee baru ke list
    this.inviteeFormList.push(newInvitee);
    
    // Pastikan juga menambahkan item baru ke selectedCountry
    this.selectedCountry.push({ selected_code: '65' });
    
    this.addInviteeText = 'Add More Invitees';
    this.isFormVisible = true;
  }

  // Method untuk update contact number berdasarkan country code dan display number
  updateContactNumber(index: number) {
    const displayNumber = this.inviteeFormList[index].contact_number_display || '';
    const countryCode = this.selectedCountry[index].selected_code || '65';
    
    // Update full contact number
    this.inviteeFormList[index].contact_number = countryCode + displayNumber;
  }

  onChangeCountryCode(event: any, index: any) {
    this.selectedCountry[index].selected_code = event.target.value;
    // Update contact number dengan country code baru
    this.updateContactNumber(index);
  }

  onChangePhoneNumber(event: any, index: any) {
    const inputValue = event.target.value;
    
    if (inputValue.length < 4) {
      this.functionMain.presentToast('Phone is not minimum character', 'danger');
      return;
    }
    if (inputValue.startsWith('0')) {
      const readyToInputPhoneNumber = inputValue.slice(1)
      this.selectedCountry[index].selected_code = '65'
      this.inviteeFormList[index].contact_number_display = readyToInputPhoneNumber;
      this.updateContactNumber(index);
      console.log(readyToInputPhoneNumber, "dari 0");
    } else if (inputValue.startsWith('6')) {
      const readyToInputPhoneNumber = inputValue.slice(2)
      const countryCodeFromContact = inputValue.substring(0, 2);
      const isValidCountryCode = this.countryCodes.some(code => code.code === countryCodeFromContact);
      if (isValidCountryCode) {
        this.selectedCountry[index].selected_code = countryCodeFromContact
        console.log(this.selectedCountry[index].selected_code);
      } else {
        this.selectedCountry[index].selected_code = '65'
        console.log(this.selectedCountry[index].selected_code);
      }
      this.inviteeFormList[index].contact_number_display = readyToInputPhoneNumber;
      this.updateContactNumber(index);
      console.log(readyToInputPhoneNumber, "dari 6");
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
        // Siapkan data untuk dikirim - gunakan contact_number yang sudah include country code
        const submitData = this.inviteeFormList.map((invitee: any) => ({
          visitor_name: invitee.visitor_name,
          contact_number: invitee.contact_number, // Sudah include country code
          vehicle_number: invitee.vehicle_number
        }));

        this.mainApiResidentService.endpointMainProcess({
          date_of_visit: this.formData.dateOfInvite, 
          entry_type: this.formData.entryType, 
          entry_title: this.formData.entryTitle,
          entry_message: this.formData.entryMessage,
          is_provide_unit: this.formData.isProvideUnit ? this.formData.isProvideUnit : false,
          facility: this.formData.facility ? this.formData.facility : 0,
          invitees: submitData,
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