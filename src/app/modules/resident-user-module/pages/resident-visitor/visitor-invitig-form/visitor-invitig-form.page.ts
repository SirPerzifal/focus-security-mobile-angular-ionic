import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { faAddressBook, faUser } from '@fortawesome/free-solid-svg-icons';
import { AlertController } from '@ionic/angular';
import { Contacts } from '@capacitor-community/contacts';

import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { Estate, FormData, Invitee } from 'src/models/resident/resident.model';
import { WebRtcService } from 'src/app/service/fs-web-rtc/web-rtc.service';
import { StorageService } from 'src/app/service/storage/storage.service';

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
      minDigit: 8, 
      maxDigit: 8,
    },
    {
      country: 'ID',
      code: '62',
      minDigit: 9,
      maxDigit: 13,
    },
    {
      country: 'MY', 
      code: '60',
      minDigit: 10,
      maxDigit: 11, 
    },
    {
      country: 'IN',
      code: '91',
      minDigit: 10,
      maxDigit: 10,
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
    facility_other: "",
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
    public functionMain: FunctionMainService,
    private webRtcService: WebRtcService,
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
      vehicle_number: '',
      company_name: '',
      host_ids: [] // Pastikan ini array kosong
    };

    const selectedCode: any = { 
      selected_code: '65'
    };

    this.inviteeFormList.push(initialInvitee);
    this.selectedCountry.push(selectedCode)
    this.isFormVisible = true; // Show form since we have at least one invitee
    this.addInviteeText = 'Add More Invitees'; // Update button text
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

      const nameFromContact = `${displayName}`.trim();
      const phoneFromContact = result.contact.phones?.[0].number || '';
      const newPhoneNumber = phoneFromContact.replace(/\D/g, '');

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
          this.inviteeFormList[this.currentInviteeIndex].visitor_name = '';
          this.inviteeFormList[this.currentInviteeIndex].contact_number_display = '';
          this.inviteeFormList[this.currentInviteeIndex].contact_number = selectedCountryCode;
        } else {
          // User memilih "Add Again" atau tidak ada duplikasi - isi data
          this.selectedCountry[this.currentInviteeIndex].selected_code = selectedCountryCode;
          this.inviteeFormList[this.currentInviteeIndex].visitor_name = nameFromContact;
          this.inviteeFormList[this.currentInviteeIndex].contact_number_display = processedNumber;
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
      contact_number: '65', // Default dengan country code
      contact_number_display: '', // Kosong untuk display
      vehicle_number: '',
      company_name: '',
      host_ids: [] // Pastikan ini array kosong
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

  async onChangePhoneNumber(event: any, index: any) {
    const proceedSelectedCountryCode = this.selectedCountry[index]?.selected_code;
    const inputValue = event.target.value;

    // Find the selected country code object from the countryCodes array
    const selectedCountry = this.countryCodes.find(country => country.code === proceedSelectedCountryCode);

    if (selectedCountry) {
      const min = selectedCountry.minDigit;
      const max = selectedCountry.maxDigit;

      if (inputValue.length < min) { 
        this.functionMain.presentToast('Phone is not minimum character', 'danger');
        return;
      } else if (inputValue.length > max) { 
        this.functionMain.presentToast('Phone is reach maximum character', 'danger'); 
        return;
      }
    } else {
      this.functionMain.presentToast('Invalid country code selected', 'danger');
      return;
    }

    let processedNumber = '';
    let selectedCountryCode = '65';

    if (inputValue.startsWith('0')) {
      processedNumber = inputValue.slice(1);
      selectedCountryCode = '65';
    } else if (inputValue.startsWith('65') || inputValue.startsWith('62')) {
      processedNumber = inputValue.slice(2);
      const countryCodeFromInput = inputValue.substring(0, 2);
      const isValidCountryCode = this.countryCodes.some(code => code.code === countryCodeFromInput);
      selectedCountryCode = isValidCountryCode ? countryCodeFromInput : '65';
    } else if (inputValue.startsWith('91')) {
      processedNumber = inputValue.slice(2);
      const countryCodeFromContact = inputValue.substring(0, 2);
      const isValidCountryCode = this.countryCodes.some(code => code.code === countryCodeFromContact);
      selectedCountryCode = isValidCountryCode ? countryCodeFromContact : '91';
    } else {
      processedNumber = inputValue;
      selectedCountryCode = this.selectedCountry[index]?.selected_code || '65';
    }

    // Buat nomor lengkap untuk pengecekan duplikasi
    const fullNumber = selectedCountryCode + processedNumber;
    
    // Cek duplikasi sebelum update
    const shouldClearInput = await this.checkIsThereNumberAlreadyOnForm(fullNumber, index);
    
    if (shouldClearInput) {
      // User memilih "Change" - kosongkan input
      event.target.value = '';
      this.inviteeFormList[index].contact_number_display = '';
      this.inviteeFormList[index].contact_number = selectedCountryCode;
    } else {
      // User memilih "Add Again" atau tidak ada duplikasi - lanjutkan update
      this.selectedCountry[index].selected_code = selectedCountryCode;
      this.inviteeFormList[index].contact_number_display = processedNumber;
      this.updateContactNumber(index);
    }
  }

  validateFormBeforeSubmit(): boolean {
    const phoneNumbers = this.inviteeFormList.map((invitee: any) => invitee.contact_number);
    const uniqueNumbers = new Set(phoneNumbers);
    
    // Cek jika ada nomor kosong
    const hasEmptyNumbers = phoneNumbers.some((num: any) => !num || num.length <= 2);
    if (hasEmptyNumbers) {
      // this.functionMain.presentToast('Please fill all phone numbers', 'danger');
      return false;
    }
    
    // Info saja jika ada duplikasi (karena user sudah dikonfirmasi sebelumnya)
    if (phoneNumbers.length !== uniqueNumbers.size) {
      console.log('Duplicate numbers detected but user has confirmed');
    }
    
    return true;
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

  yserType: string = '';

  familyId: number = 0;

  entryCheck: { [key: number]: string } = {}; // Ubah jadi object untuk tracking per index
  Host: any = []
  selectedHost: any = []

  loadHost() {
    this.mainApiResidentService.endpointMainProcess({}, 'get/family').subscribe((value: any) => {
      console.log(value)
      this.Host = value.result.result.map((item: any) => ({ id: item.id, name: item.host_name }));
    })
  }

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

  hostChange(event: any, index: number) {
    // Set host_ids dengan nilai yang dipilih dari m2m-selection
    this.inviteeFormList[index].host_ids = event;
  }

  onSubmit(from?: string) {
    let errMsg = '';
    this.inviteeFormList.forEach((invitee: any, index: number) => {
      if (invitee.visitor_name.trim() === '') {
        errMsg += `Form ${index + 1}: Please fill visitor Name!\n`;
      }
      if (invitee.contact_number.trim() === '') {
        errMsg += `Form ${index + 1}: Please fill contact number!\n`;
      }
      if (!invitee.host_ids || invitee.host_ids.length === 0 && this.yserType === 'industrial') {
        errMsg += `Form ${index + 1}: Please choose host!\n`;
      }
    });
    if (errMsg !== '') {
      this.functionMain.presentToast(errMsg, 'danger');
      return;
    }
    const isValid = this.inviteeFormList.every((invitee: any) => 
      invitee.visitor_name.trim() !== '' && 
      invitee.contact_number.trim() !== ''
    );

    // Validasi form sebelum submit
    const isFormValid = this.validateFormBeforeSubmit();

    if (isValid && isFormValid) {
      console.log(this.inviteeFormList);
      
      try {
        const submitData = this.inviteeFormList.map((invitee: any) => ({
          visitor_name: invitee.visitor_name,
          contact_number: invitee.contact_number,
          vehicle_number: invitee.vehicle_number,
          company_name: invitee.company_name,
          host_ids: invitee.host_ids
        }));

        this.mainApiResidentService.endpointMainProcess({
          date_of_visit: this.formData.dateOfInvite, 
          entry_type: this.formData.entryType, 
          entry_title: this.formData.entryTitle,
          entry_message: this.formData.entryMessage,
          is_provide_unit: this.formData.isProvideUnit ? this.formData.isProvideUnit : false,
          facility: this.formData.facility === 'other' || this.formData.facility === 'no_facility' ? 0 : Number(this.formData.facility),
          invitees: submitData,
          hired_car: this.formData.hiredCar,
          facility_other: this.formData.facility_other,
          from: from
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
              facility_other: "",
              hiredCar: "",
            }
            this.router.navigate(['/visitor-main'], {
              queryParams: {
                openActive: true,
                formData: null
              }
            });
          } else if (response.result.status_code === 206) {
            if (this.yserType === 'resident') {
              if (response.result.status === 'unit same') {
                this.functionMain.presentToast('Visitor has been ban on this unit!', 'danger');
              } else {
                this.presentAlertForBannedVisitor(`${response.result.family_ban_name} (${response.result.unit_name})`, response.result.family_ban_id);
              }
            } else {
              this.functionMain.presentToast('Visitor has been ban!', 'danger');
            }
          } else {
            if (response.result.response_description.startsWith('Duplicate Entry For')) {
              const [separated, duplicate, entry, number] = response.result.response_description.split(' ');
              // const numberDuplicate = 
              this.functionMain.presentToast(`Visitor with number ${number} has already been invited.`, 'danger');
            } else {
              this.functionMain.presentToast('Failed Add Invite', 'danger');
            }
          }
        })
      } catch (error) {
        console.error('Unexpected error:', error);
        this.functionMain.presentToast(String(error), 'danger');
      }
    }
  }

  shouldShowForm(): boolean {
    return this.isFormVisible; // Use the new variable to control visibility
  }

  async presentAlertForBannedVisitor(residentName: string, residentId: number) {
    const alert = await this.alertController.create({
      cssClass: 'custom-alert-class-resident-visitors-page',
      header: 'This visitor has been banned!',
      message: `Kindly call ${residentName} to verify this ban,`, 
      buttons: [
        {
          text: 'Call',
          cssClass: 'confirm-button',
          handler: () => {
            this.webRtcService.createOffer(false, residentId, false, false).then((result: any) => {
              // console.log(result, "valuereturnoffercallsvaluereturnoffercallsvaluereturnoffercallsvaluereturnoffercallsvaluereturnoffercallsvaluereturnoffercalls");
              
              // if (result === 'reject' || result === 'cancel' || result.endsWith('is not logged on any devices')) {
              //   console.log('suk sini atas');
                
              //   alert.dismiss();
              // } else {
              //   console.log('suk sini bawah');
                
                this.presentAlertForBannedVisitorAfterCall()
              // }
            });
          }
        },
      ]
    });
  
    await alert.present();
  }

  async presentAlertForBannedVisitorAfterCall() {
    const alert = await this.alertController.create({
      cssClass: 'custom-alert-class-resident-visitors-page',
      message: `Whats the decision?`, 
      buttons: [
        {
          text: 'Proceed',
          cssClass: 'confirm-button',
          handler: () => {
            this.onSubmit('proceed_anyway')
          }
        },{
          text: 'Cancel',
          cssClass: 'cancel-button',
          handler: () => {
          }
        }
      ]
    });
  
    await alert.present();
  }

  // UPDATE COMPLETE method initializeInviteeForm():
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
        console.log(invitee);
        
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
          company_name: invitee.company_name || '',
          host_ids: invitee.host_ids || [] // PERBAIKAN: Pertahankan data asli, jangan paksa array kosong
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
    
    // PERBAIKAN: Setup entryCheck setelah semua data dimuat dan familyId tersedia
    setTimeout(() => {
      this.setupEntryChecks();
    }, 500); // Increase timeout to ensure familyId is loaded
  }

  // Perbaiki method setupEntryChecks() untuk handle case ketika yserType belum diset:
  private setupEntryChecks() {
    this.inviteeFormList.forEach((invitee: any, index: number) => {
      const hostIdsCount = invitee.host_ids?.length || 0;
      
      if (hostIdsCount > 1) {
        this.entryCheck[index] = "other_host";
      } else if (hostIdsCount === 1 && invitee.host_ids[0] === this.familyId) {
        this.entryCheck[index] = "myself";
      } else if (hostIdsCount === 1 && invitee.host_ids[0] !== this.familyId) {
        this.entryCheck[index] = "other_host";
      } else {
        this.entryCheck[index] = "";
      }
    });
  }

  // Tambahkan method untuk re-setup entryChecks saat yserType berubah:
  onChangeTypeOfUser(event: any) {
    this.yserType = event;
    
    if (this.yserType === 'industrial') {
      this.loadHost();
      this.loadFamilyId();
      
      // Re-setup entryChecks setelah familyId dimuat
      setTimeout(() => {
        this.setupEntryChecks();
      }, 500);
    }
  }

  // Perbaiki method loadFamilyId() untuk langsung setup entryChecks:
  loadFamilyId() {
    this.storage.getValueFromStorage('USESATE_DATA').then((value: any) => {
      if (value) {
        this.storage.decodeData(value).then((value: any) => {
          if (value) {
            const estate = JSON.parse(value) as Estate;
            this.familyId = estate.family_id;
            
            // Setup entryChecks setelah familyId dimuat
            if (this.inviteeFormList.length > 0) {
              this.setupEntryChecks();
            }
          }
        });
      }
    });
  }
}