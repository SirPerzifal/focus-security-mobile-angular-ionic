import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { faAddressBook, faUser } from '@fortawesome/free-solid-svg-icons';
import { AlertController } from '@ionic/angular';
import { Contacts } from '@capacitor-community/contacts';

import { StorageService } from 'src/app/service/storage/storage.service';
import { Estate } from 'src/models/resident/resident.model';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { FormData, Invitee } from 'src/models/resident/resident.model';

@Component({
  selector: 'app-contractor-inviting-form',
  templateUrl: './contractor-inviting-form.page.html',
  styleUrls: ['./contractor-inviting-form.page.scss'],
})
export class ContractorInvitingFormPage implements OnInit {

  faUser = faUser
  faAddressBook = faAddressBook
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
    // hiredCar: "",
    // isProvideUnit: false,
  }
  entryCheck: string = '';
  showOther: boolean = false;

  nameFromContact = '';
  phoneFromContact = '';

  currentInviteeIndex: number | null = null; // Track the index of the invitee being edited

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private mainApiResidentService: MainApiResidentService,
    public functionMain: FunctionMainService,
    private storage: StorageService
  ) {
    this.addInitialInvitee();
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { formData: FormData, selectedInvitees: Invitee[] };
  
    if (state) {
        this.formData = {
          ...state.formData,
          dateOfInvite: new Date(state.formData.dateOfInvite) // Ensure this is a Date object
        };
      if (state.selectedInvitees) {
        this.inviteeFormList = state.selectedInvitees; // Update local list
        this.isFormVisible = true; // Show form if there are invitees
        this.addInviteeText = 'Add More Invitees'; // Update button text
      }
    }
  }

  ngOnInit() {
    this.loadHost();
    this.isFormInitialized = false;
    // Gunakan setTimeout untuk memastikan rendering
    this.route.queryParams.subscribe(params => {
      this.initializeInviteeForm(params);
    });
  }

  addInitialInvitee() {
    const initialInvitee: any = { 
      contractor_name: '', 
      contact_number: '', 
      vehicle_number: '',
      company_name: '',
      type_of_work: '',
      expected_number_of_visit: '',
      host_ids: []
    };

    this.inviteeFormList.push(initialInvitee);
    this.isFormVisible = true; // Show form since we have at least one invitee
    this.addInviteeText = 'Add More Invitees'; // Update button text
  }

  onchangeTypeOfWork(event: any, type?: string, index?: any) {
    const value = event.target.value;
    if (value === 'Others' && type === 'select') {
      this.showOther = true;
    } else if (type === 'input') {
      this.showOther = true;
      this.inviteeFormList[index].type_of_work = event.target.value;
    } else {
      this.showOther = false;
    }
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
        contractor_name: invitee.contractor_name || '',
        contact_number: invitee.contact_number || '',
        vehicle_number: invitee.vehicle_number || '',
        company_name: invitee.company_name || '',
        type_of_work: invitee.type_of_work || '',
        expected_number_of_visit: invitee.expected_number_of_visit || '',
        host_ids: invitee.host_ids || []
      }));
      this.addInviteeText = 'Add More Invitees';
    }

    if (this.inviteeFormList.length > 0) {
      this.isFormVisible = true; // Show form if there are invitees
    }

    this.isFormInitialized = true;
  }

  changeHost(event: any, index: any) {
    this.entryCheck = event.value;
    if (event.value === 'myself') {
      this.storage.getValueFromStorage('USESATE_DATA').then((value: any) => {
        if ( value ) {
          this.storage.decodeData(value).then((value: any) => {
            if ( value ) {
              const estate = JSON.parse(value) as Estate;
              this.inviteeFormList[index].host_ids.push(estate.family_id);
            }
          })
        }
      })
    } else {
      this.storage.getValueFromStorage('USESATE_DATA').then((value: any) => {
        if ( value ) {
          this.storage.decodeData(value).then((value: any) => {
            if ( value ) {
              const estate = JSON.parse(value) as Estate;
              this.inviteeFormList[index].host_ids.push(estate.family_id);
            }
          })
        }
      })
    }
  }

  hostChange(event: any, index: any) {
    console.log(this.inviteeFormList[index].host_ids, event)
    this.inviteeFormList[index].host_ids = [...event, ...this.inviteeFormList[index].host_ids];
  }

  Host: any = []
  selectedHost: any = []

  loadHost() {
    this.mainApiResidentService.endpointMainProcess({}, 'get/family').subscribe((value: any) => {
      console.log(value)
      this.Host = value.result.result.map((item: any) => ({ id: item.id, name: item.host_name }));
    })
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
        this.inviteeFormList[this.currentInviteeIndex].contractor_name = nameFromContact;
        this.inviteeFormList[this.currentInviteeIndex].contact_number = phoneFromContact;
      } else {
        // If no invitee is selected, create a new one
        const newInvitee: any = {
          contractor_name: nameFromContact,
          contact_number: phoneFromContact,
          vehicle_number: '' // Set this as needed
        };
        this.inviteeFormList.push(newInvitee);
      }
  
      this.isFormVisible = true; // Show form if there are invitees
      this.addInviteeText = 'Add More Invitees'; // Update button text
    }
  }

  showTimeInfo() {
    this.isModalOpen = true; // Membuka modal
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
      contractor_name: '', 
      contact_number: '', 
      vehicle_number: '',
      company_name: '',
      type_of_work: '',
      expected_number_of_visit: '',
      host_ids: []
    };
    
    this.inviteeFormList.push(newInvitee);
    this.addInviteeText = 'Add More Invitees';
    this.isFormVisible = true;
  }

  navigateToInviteFormHistory() {
    this.router.navigate(['/contractor-inviting-from-history'], { 
      state: { existingInvitees: this.inviteeFormList } 
    });
  }

  backWithState() {
    this.router.navigate(['/contractor-commercial-main'], {
      state: {
        openActive: true,
      }
    });
  }

  onSubmit() {
    console.log(this.inviteeFormList)
    let errMsg = '';
    this.inviteeFormList.every((invitee:any) => {
      if (invitee.contractor_name.trim() === '') {
        errMsg += 'Please fill contractor Name! \n';
      } else if (invitee.contact_number.trim() === '') {
        errMsg += 'Please fill contact number! \n';
      } else if (invitee.type_of_work.trim() === '') {
        errMsg += 'Please fill type of work! \n';
      } else if (invitee.company_name.trim() === '') {
        errMsg += 'Please fill company name! \n';
      } else if (invitee.host_ids.length <= 0) {
        errMsg += 'Please choos whether show just you or include another host! \n';
      } else if (invitee.expected_number_of_visit.trim() === '') {
        errMsg += 'Please fill expected number of visit! \n';
      }
    }
    );

    if (!errMsg) {
      try {
        this.mainApiResidentService.endpointMainProcess({
          date_of_visit: this.formData.dateOfInvite, 
          entry_type: this.formData.entryType, 
          entry_title: this.formData.entryTitle,
          entry_message: this.formData.entryMessage,
          // is_provide_unit: this.formData.isProvideUnit,
          invitees: this.inviteeFormList,
        }, 'post/create_expected_contractor').subscribe((response: any) => {
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
              // isProvideUnit: false,
            }
            this.router.navigate(['/contractor-commercial-main'], {
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
      this.functionMain.presentToast(errMsg, 'danger');
    }
  }

  shouldShowForm(): boolean {
    return this.isFormVisible; // Use the new variable to control visibility
  }

  backToPrevPage() {
    this.router.navigate(['contractor-commercial-main'])
  }

}
