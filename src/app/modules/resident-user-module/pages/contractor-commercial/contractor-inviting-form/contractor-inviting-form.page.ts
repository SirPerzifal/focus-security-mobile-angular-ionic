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
    {
      country: 'IN',
      code: '91',
      digit: 9,
    },
  ]

  formData = {
    dateOfInvite: new Date(),
    vehicleNumber: "",
    entryType: "",
    entryTitle: "",
    entryMessage: "",
    // hiredCar: "",
    // isProvideUnit: false,
  }
  familyId: number = 0;
  entryCheck: { [key: number]: string } = {}; // Ubah jadi object untuk tracking per index
  showOther: boolean[] = [];

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
    this.loadFamilyId(); // Tambahkan method untuk load family ID
    this.isFormInitialized = false;
    
    // Jika selectedCountry belum diinisialisasi
    if (!this.selectedCountry || this.selectedCountry.length === 0) {
      this.selectedCountry = [];
    }
    // Gunakan setTimeout untuk memastikan rendering
    this.route.queryParams.subscribe(params => {
      console.log(params);
      
      this.initializeInviteeForm(params);
    });
  }

  // Method baru untuk load family ID saat komponen dimuat
  loadFamilyId() {
    this.storage.getValueFromStorage('USESATE_DATA').then((value: any) => {
      if (value) {
        this.storage.decodeData(value).then((value: any) => {
          if (value) {
            const estate = JSON.parse(value) as Estate;
            this.familyId = estate.family_id;
          }
        });
      }
    });
  }

  // Method untuk mengecek apakah host adalah diri sendiri
  isHostMyself(index: number): boolean {
    const hostIds = this.inviteeFormList[index]?.host_ids || [];
    return hostIds.length === 1 && hostIds[0] === this.familyId;
  }

  // Perbaikan method addInitialInvitee
  addInitialInvitee() {
    const initialInvitee: any = { 
      contractor_name: '', 
      contact_number: '', 
      phone_display: '',
      vehicle_number: '',
      company_name: '',
      type_of_work: '',
      expected_number_of_visit: '',
      host_ids: [] // Pastikan ini array kosong
    };
    
    const selectedCode: any = { 
      selected_code: '65'
    };

    this.inviteeFormList.push(initialInvitee);
    this.selectedCountry.push(selectedCode);
    this.isFormVisible = true;
    this.addInviteeText = 'Add More Invitees';
  }

  onchangeTypeOfWork(event: any, type?: string, index?: any) {
    const value = event.target.value;
    
    if (type === 'select') {
      // Ketika user memilih dari dropdown
      if (value === 'Others') {
        this.showOther[index] = true;
        this.inviteeFormList[index].type_of_work = 'Others';
      } else {
        this.showOther[index] = false;
        this.inviteeFormList[index].type_of_work = value;
      }
    } else if (type === 'input') {
      // Ketika user mengetik di input "Others"
      // this.inviteeFormList[index].type_of_work = value;
      this.inviteeFormList[index].other = value;
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

    if (selectedInvitees?.length > 0) {
      this.initializeFormData();
      this.processInviteeData(selectedInvitees);
      this.addInviteeText = 'Add More Invitees';
    }
    
    // Pastikan selectedCountry memiliki ukuran yang sama dengan inviteeFormList
    this.ensureSelectedCountrySync();
    
    if (this.inviteeFormList.length > 0) {
      this.isFormVisible = true;
    }

    this.isFormInitialized = true;
  }

  private initializeFormData() {
    this.showOther = [];
    this.entryCheck = {};
    this.inviteeFormList = [];
  }

  private processInviteeData(selectedInvitees: any[]) {
    this.inviteeFormList = selectedInvitees.map((invitee: any) => {
      const phoneData = this.parsePhoneNumber(invitee.contact_number || '');
      
      // Cara yang lebih clean dan readable
      const standardPurposes = ['delivery', 'collection', 'meeting'];
      const purposeLower = (invitee.purpose || '').toLowerCase();
      const isStandardPurpose = standardPurposes.includes(purposeLower);
      
      const formData: any = {
        contractor_name: invitee.contractor_name || '',
        contact_number: invitee.contact_number || '',
        phone_display: phoneData.display,
        vehicle_number: invitee.vehicle_number || '',
        company_name: invitee.company_name || '',
        type_of_work: isStandardPurpose ? invitee.purpose : 'Others',
        expected_number_of_visit: invitee.expected_number_of_visit || '',
        host_ids: invitee.host_ids || []
      };

      // Tambahkan field other jika bukan standard purpose
      if (!isStandardPurpose && invitee.purpose) {
        formData.other = invitee.purpose;
      }

      return formData;
    });

    this.setupShowOtherFlags();
    this.setupEntryChecks();
    this.setupSelectedCountry(selectedInvitees);
    
    console.log('Processed invitee form list:', this.inviteeFormList);
  }

  private parsePhoneNumber(contactNumber: string): { display: string; countryCode: string } {
    // Default values
    let display = contactNumber;
    let countryCode = '65';

    // Improved phone number parsing
    if (contactNumber) {
      // Handle Singapore numbers (+65)
      if (contactNumber.startsWith('65') && contactNumber.length > 4) {
        countryCode = '65';
        display = contactNumber.substring(2);
      }
      // Handle other country codes as needed
      else if (contactNumber.startsWith('+')) {
        // Handle international format
        const withoutPlus = contactNumber.substring(1);
        if (withoutPlus.startsWith('65')) {
          countryCode = '65';
          display = withoutPlus.substring(2);
        }
        // Add other country codes handling here
      }
    }

    return { display, countryCode };
  }

  private setupShowOtherFlags() {
    const standardPurposes = ['delivery', 'collection', 'meeting'];
    
    this.showOther = this.inviteeFormList.map((invitee: any) => {
      const purpose = invitee.type_of_work?.toLowerCase() || '';
      return purpose && !standardPurposes.includes(purpose);
    });
  }

  private setupEntryChecks() {
    this.inviteeFormList.forEach((invitee: any, index: number) => {
      const hostIdsCount = invitee.host_ids?.length || 0;
      
      if (hostIdsCount > 1) {
        this.entryCheck[index] = "other_host";
      } else if (hostIdsCount === 1) {
        this.entryCheck[index] = "myself";
      } else {
        this.entryCheck[index] = "";
      }
    });
  }

  private setupSelectedCountry(selectedInvitees: any[]) {
    this.selectedCountry = selectedInvitees.map((invitee: any) => {
      const phoneData = this.parsePhoneNumber(invitee.contact_number || '');
      return {
        selected_code: phoneData.countryCode
      };
    });
  }

  private ensureSelectedCountrySync() {
    // Pastikan selectedCountry memiliki ukuran yang sama dengan inviteeFormList
    while (this.selectedCountry.length < this.inviteeFormList.length) {
      this.selectedCountry.push({ selected_code: '65' });
    }
    
    // Potong jika terlalu panjang
    if (this.selectedCountry.length > this.inviteeFormList.length) {
      this.selectedCountry = this.selectedCountry.slice(0, this.inviteeFormList.length);
    }
  }

  // Perbaikan method changeHost
  changeHost(event: any, index: number) {
    const selectedValue = event.value;
    this.entryCheck[index] = selectedValue;

    if (selectedValue === 'myself') {
      // Set host_ids hanya berisi familyId
      this.inviteeFormList[index].host_ids = [this.familyId];
    } else if (selectedValue === 'other_host') {
      // Reset host_ids untuk memungkinkan pemilihan host lain
      this.inviteeFormList[index].host_ids = [];
    }
  }

  // Perbaikan method hostChange
  hostChange(event: any, index: number) {
    // Set host_ids dengan nilai yang dipilih dari m2m-selection
    this.inviteeFormList[index].host_ids = event;
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
      const nameFromContact = `${displayName}`.trim();
      const phoneFromContact = result.contact.phones?.[0].number || '';
      const newPhoneNumber = phoneFromContact.replace(/\D/g, '')

      if (this.currentInviteeIndex !== null) {
        let processedNumber = '';
        let selectedCountryCode = '65';

        if (newPhoneNumber.startsWith('0')) {
          processedNumber = newPhoneNumber.slice(1);
          selectedCountryCode = '65';
        } else if (newPhoneNumber.startsWith('65') || newPhoneNumber.startsWith('62')) {
          processedNumber = newPhoneNumber.slice(2);
          const countryCodeFromContact = newPhoneNumber.substring(0, 2);
          const isValidCountryCode = this.countryCodes.some(code => code.code === countryCodeFromContact);
          selectedCountryCode = isValidCountryCode ? countryCodeFromContact : '65';
        } else if (newPhoneNumber.startsWith('91')) {
          processedNumber = newPhoneNumber.slice(2);
          const countryCodeFromContact = newPhoneNumber.substring(0, 2);
          const isValidCountryCode = this.countryCodes.some(code => code.code === countryCodeFromContact);
          selectedCountryCode = isValidCountryCode ? countryCodeFromContact : '91';
        } else {
          processedNumber = newPhoneNumber;
          selectedCountryCode = '65';
        }

        // Buat nomor lengkap untuk pengecekan duplikasi
        const fullNumber = selectedCountryCode + processedNumber;
        
        // Cek duplikasi
        const shouldClearInput = await this.checkIsThereNumberAlreadyOnForm(fullNumber, this.currentInviteeIndex);
        
        if (shouldClearInput) {
          // User memilih "Change" - kosongkan input
          this.inviteeFormList[this.currentInviteeIndex].contractor_name = '';
          this.inviteeFormList[this.currentInviteeIndex].phone_display = '';
          this.inviteeFormList[this.currentInviteeIndex].contact_number = selectedCountryCode;
        } else {
          // User memilih "Add Again" atau tidak ada duplikasi - isi data
          this.selectedCountry[this.currentInviteeIndex].selected_code = selectedCountryCode;
          this.inviteeFormList[this.currentInviteeIndex].contractor_name = nameFromContact;
          this.inviteeFormList[this.currentInviteeIndex].phone_display = processedNumber;
          this.updateContactNumber(this.currentInviteeIndex);
        }
      }

      this.isFormVisible = true;
      this.addInviteeText = 'Add More Invitees';
    }
  }

  showTimeInfo() {
    this.isModalOpen = true; // Membuka modal
  }

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

  // Perbaikan method addInvitee
  addInvitee() {
    const newInvitee: any = { 
      contractor_name: '', 
      contact_number: '', 
      phone_display: '',
      vehicle_number: '',
      company_name: '',
      type_of_work: '',
      expected_number_of_visit: '',
      host_ids: [] // Pastikan ini array kosong
    };
    
    this.inviteeFormList.push(newInvitee);
    this.selectedCountry.push({ selected_code: '65' });
    this.addInviteeText = 'Add More Invitees';
    this.isFormVisible = true;
  }

  navigateToInviteFormHistory() {
    console.log(this.inviteeFormList);
    
    this.router.navigate(['/contractor-inviting-from-history'], { 
      state: { existingInvitees: this.inviteeFormList } 
    });
  }

  backWithState() {
    this.router.navigate(['/contractor-commercial-main'], {
      state: {
        formData: this.formData,
      }, 
      queryParams: {
        reload: true
      }
    });
  }

  selectedCountry: any[] = [];
  
  onChangeCountryCode(event: any, index: any) {
    this.selectedCountry[index].selected_code = event.target.value;
    // Update contact_number ketika country code berubah
    this.updateContactNumber(index);
  }

  async onChangePhoneNumber(event: any, index: any) {
    const phoneValue = event.target.value;
    
    if (phoneValue.length < 4) {
      this.functionMain.presentToast('Phone is not minimum character', 'danger');
      return;
    }

    let processedNumber = '';
    let selectedCountryCode = '65';

    if (phoneValue.startsWith('0')) {
      processedNumber = phoneValue.slice(1);
      selectedCountryCode = '65';
      console.log(processedNumber, "dari 0");
    } else if (phoneValue.startsWith('65') || phoneValue.startsWith('62')) {
      processedNumber = phoneValue.slice(2);
      const countryCodeFromInput = phoneValue.substring(0, 2);
      const isValidCountryCode = this.countryCodes.some(code => code.code === countryCodeFromInput);
      selectedCountryCode = isValidCountryCode ? countryCodeFromInput : '65';
    } else if (phoneValue.startsWith('91')) {
      processedNumber = phoneValue.slice(2);
      const countryCodeFromContact = phoneValue.substring(0, 2);
      const isValidCountryCode = this.countryCodes.some(code => code.code === countryCodeFromContact);
      selectedCountryCode = isValidCountryCode ? countryCodeFromContact : '91';
    } else {
      // Jika nomor telepon tidak dimulai dengan '0' atau '6', tetap simpan nomor telepon
      processedNumber = phoneValue;
      selectedCountryCode = this.selectedCountry[index]?.selected_code || '65';
    }

    // Buat nomor lengkap untuk pengecekan duplikasi
    const fullNumber = selectedCountryCode + processedNumber;
    
    // Cek duplikasi sebelum update
    const shouldClearInput = await this.checkIsThereNumberAlreadyOnForm(fullNumber, index);
    
    if (shouldClearInput) {
      // User memilih "Change" - kosongkan input
      event.target.value = '';
      this.inviteeFormList[index].phone_display = '';
      this.inviteeFormList[index].contact_number = selectedCountryCode;
    } else {
      // User memilih "Add Again" atau tidak ada duplikasi - lanjutkan update
      this.selectedCountry[index].selected_code = selectedCountryCode;
      this.inviteeFormList[index].phone_display = processedNumber;
      this.updateContactNumber(index);
    }
  }

  // Method baru untuk update contact_number
  updateContactNumber(index: any) {
    const countryCode = this.selectedCountry[index]?.selected_code || '65';
    const phoneDisplay = this.inviteeFormList[index]?.phone_display || '';
    
    if (phoneDisplay.trim() !== '') {
      this.inviteeFormList[index].contact_number = countryCode + phoneDisplay;
    } else {
      this.inviteeFormList[index].contact_number = '';
    }
  }

  async checkIsThereNumberAlreadyOnForm(number: string, currentIndex: number): Promise<boolean> {
    // Membuat nomor lengkap dengan country code untuk perbandingan
    const fullNumber = number;
    
    // Cek apakah nomor sudah ada di form (kecuali di index yang sedang diedit)
    const isDuplicate = this.inviteeFormList.some((invitee: any, index: number) => 
      index !== currentIndex && invitee.contact_number === fullNumber
    );
    
    if (isDuplicate) {
      // Tampilkan alert dengan pilihan
      return await this.presentDuplicateAlert();
    }
    
    return false; // Tidak ada duplikasi
  }

  async presentDuplicateAlert(): Promise<boolean> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        cssClass: 'custom-alert-class-resident-visitors-page',
        header: 'Duplicate Number Detected',
        message: 'You input the same number on previous form. Do you want to add again or change it?',
        buttons: [
          {
            text: 'Add Again',
            cssClass: 'confirm-button',
            handler: () => {
              resolve(false); // Return false berarti tidak ada masalah, lanjutkan input
            }
          },
          {
            text: 'Change',
            cssClass: 'cancel-button',
            handler: () => {
              resolve(true); // Return true berarti user ingin mengubah, kosongkan input
            }
          }
        ]
      });

      await alert.present();
    });
  }

  validateFormBeforeSubmit(): boolean {
    const phoneNumbers = this.inviteeFormList.map((invitee: any) => invitee.contact_number);
    const uniqueNumbers = new Set(phoneNumbers);
    
    // Cek jika ada nomor kosong
    const hasEmptyNumbers = phoneNumbers.some((num: any) => !num || num.length <= 2);
    if (hasEmptyNumbers) {
      this.functionMain.presentToast('Please fill all phone numbers', 'danger');
      return false;
    }
    
    // Info saja jika ada duplikasi (karena user sudah dikonfirmasi sebelumnya)
    if (phoneNumbers.length !== uniqueNumbers.size) {
      console.log('Duplicate numbers detected but user has confirmed');
    }
    
    return true;
  }

  // Perbaikan validasi di onSubmit
  onSubmit() {
    console.log(this.inviteeFormList);
    let errMsg = '';
    
    this.inviteeFormList.forEach((invitee: any, index: number) => {
      if (invitee.contractor_name.trim() === '') {
        errMsg += `Form ${index + 1}: Please fill contractor Name!\n`;
      }
      if (invitee.contact_number.trim() === '') {
        errMsg += `Form ${index + 1}: Please fill contact number!\n`;
      }
      if (invitee.company_name.trim() === '') {
        errMsg += `Form ${index + 1}: Please fill company name!\n`;
      }
      if (!invitee.host_ids || invitee.host_ids.length === 0) {
        errMsg += `Form ${index + 1}: Please choose host!\n`;
      }
      if (invitee.type_of_work === 'Others') {
        invitee.type_of_work = invitee.other
      }
    });

    // Validasi form sebelum submit
    const isFormValid = this.validateFormBeforeSubmit();

    if (errMsg === '' && isFormValid) {
      // Set entry type berdasarkan expected number of visit
      const hasMultipleVisits = this.inviteeFormList.some((invitee: any) => 
        invitee.expected_number_of_visit > 1
      );
      this.formData.entryType = hasMultipleVisits ? 'multiple_entry' : 'one_time_entry';


      // Lanjutkan dengan API call...
      this.submitInvitation();
    } else if (errMsg !== '') {
      this.functionMain.presentToast(errMsg, 'danger');
    }
  }

  // Method terpisah untuk submit invitation
  private submitInvitation() {
    this.mainApiResidentService.endpointMainProcess({
      date_of_visit: this.formData.dateOfInvite, 
      entry_type: this.formData.entryType, 
      entry_title: this.formData.entryTitle,
      entry_message: this.formData.entryMessage,
      invitees: this.inviteeFormList,
    }, 'post/create_expected_contractor').subscribe((response: any) => {
      if (response.result.response_code == 200) {
        this.functionMain.presentToast('Success Add Invite', 'success');
        this.resetForm();
        this.router.navigate(['/contractor-commercial-main'], {
          queryParams: {
            openActive: true,
            formData: null
          }
        });
      } else if (response.result.status_code === 206) {
        this.functionMain.presentToast('Contractor has been banned!', 'danger');
      } else {
        if (response.result.response_description.startsWith('Duplicate Entry For')) {
          const [separated, duplicate, entry, number] = response.result.response_description.split(' ');
          // const numberDuplicate = 
          this.functionMain.presentToast(`Duplicate invite for ${number}.`, 'danger');
        } else {
          this.functionMain.presentToast('Failed Add Invite', 'danger');
        }
      }
    });
  }

  // Method untuk reset form
  private resetForm() {
    this.inviteeFormList = [];
    this.selectedCountry = [];
    this.entryCheck = {};
    this.isFormVisible = false;
    this.addInviteeText = 'Add Invitee';
    this.formData = {
      dateOfInvite: new Date(),
      vehicleNumber: "",
      entryType: "",
      entryTitle: "",
      entryMessage: "",
    };
  }

  shouldShowForm(): boolean {
    return this.isFormVisible; // Use the new variable to control visibility
  }

  backToPrevPage() {
    this.router.navigate(['contractor-commercial-main'])
  }

}