import { Component, OnDestroy, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { Subscription } from 'rxjs';
import { AlertController } from '@ionic/angular';

import { StorageService } from 'src/app/service/storage/storage.service';
import { Estate } from 'src/models/resident/resident.model';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { WebRtcService } from 'src/app/service/fs-web-rtc/web-rtc.service';

interface InputForm {
  nameCondominium: string;
  statusOwner: string;
  blockName: string;
  unitName: string;
  email: string;
  phone: string;
}

interface InputData {
  id: string;
  formParams: keyof InputForm; // Menggunakan keyof untuk memastikan hanya kunci yang valid
  name: string;
  disabledInput: boolean;
}

interface pet {
  id: number;
  notes: string;
  pet_breed: string;
  pet_image: string;
  type_of_pet: string;
  upload_license: string;
}

@Component({
  selector: 'app-profile-main',
  templateUrl: './profile-main.page.html',
  styleUrls: ['./profile-main.page.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class ProfileMainPage implements OnInit, OnDestroy {

  pageName: string = '';
  showMain: boolean = true;
  showEstate: boolean = false;
  showBanVisitorContractor: boolean = false;
  showPets: boolean = false;

  imageProfile: string = '';
  userName: string = '';
  userType: string = '';
  inputForm: InputForm = {
    nameCondominium: '',
    statusOwner: '',
    blockName: '',
    unitName: '',
    email: '',
    phone: '',
  }

  inputData: InputData[] = [
    {
      id: 'condominium_name',
      formParams: 'nameCondominium',
      name: 'Condominium Name',
      disabledInput: true
    },    {
      id: 'status_owner',
      formParams: 'statusOwner',
      name: 'Status',
      disabledInput: true
    },    {
      id: 'block_name',
      formParams: 'blockName',
      name: 'Block',
      disabledInput: true
    },    {
      id: 'unit_name',
      formParams: 'unitName',
      name: 'Unit',
      disabledInput: true
    },    {
      id: 'email_owner',
      formParams: 'email',
      name: 'Email',
      disabledInput: true
    },    {
      id: 'phone_number',
      formParams: 'phone',
      name: 'Contact',
      disabledInput: true
    }
  ]

  squareButton: any[] = [
    {
      name: 'Family',
      src: 'assets/icon/resident-icon/profile/Add User Group Woman Man.webp',
    },    {
      name: 'Employee',
      src: 'assets/icon/resident-icon/profile/Furniture.webp',
    },    {
      name: 'Estate',
      src: 'assets/icon/resident-icon/profile/Home.png',
    },    {
      name: 'Ban',
      src: 'assets/icon/resident-icon/profile/No User.webp',
    },    {
      name: 'Pets',
      src: 'assets/icon/resident-icon/profile/Pets.webp',
    },    {
      name: 'Vehicles',
      src: 'assets/icon/resident-icon/profile/Oncoming Automobile.webp',
    }
  ]

  disabledInput: boolean = true;

  //for estate
  profileEstate: Estate[] = [];
  isLoading: boolean = false;
  activeUnit : number = 0;
  noData: boolean = false;

  //for ban
  historyData: Array<{
    purpose: string;
    visitor_name: string;
    visitor_date: string;
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
  }> = [];

  //for contractor
  filteredData: Array<{
    purpose: string;
    visitor_name: string;
    visitor_date: string;
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
  }> = [];

  //for pet
  petList: pet[] = [];

  constructor(
    private webRtcService: WebRtcService,
    public functionMain: FunctionMainService,
    private storage: StorageService,
    private router: Router,
    private mainResident: MainApiResidentService,
    private alertController: AlertController
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { from: any };
    if (state) {
      if (state.from === 'detail-history-in-visitor') {
        this.pageName = 'Ban'
        this.showMain = false;
        this.showEstate = false;
        this.showPets = false;
        this.showBanVisitorContractor = true;
        this.getHistoryList();
        if (this.userType) {
          this.getHistoryContrctorList();
        }
      } else if (state.from === 'pets-detail-for-profile') {
        this.pageName = 'My Pets';
        this.showMain = false;
        this.showEstate = false;
        this.showBanVisitorContractor = false;
        this.showPets = true;
        this.loadPet();
      }
    }
  }

  ionViewWillEnter() {
    this.storage.getValueFromStorage('USESATE_DATA').then((value: any) => {
      this.storage.decodeData(value).then((value: any) => {
        if ( value ) {
          const estate = JSON.parse(value) as Estate;
          this.imageProfile = estate.image_profile;
          this.userName = estate.family_name;
          this.userType = estate.record_type;
          if (this.userType === 'industrial') {
            this.inputData = [
              {
                id: 'condominium_name',
                formParams: 'nameCondominium',
                name: 'Project Name',
                disabledInput: true
              },    {
                id: 'email_owner',
                formParams: 'email',
                name: 'Email',
                disabledInput: this.disabledInput
              },    {
                id: 'phone_number',
                formParams: 'phone',
                name: 'Contact',
                disabledInput: this.disabledInput
              }
            ]
            this.inputForm = {
              nameCondominium: estate.project_name,
              statusOwner: estate.family_type,
              blockName: estate.block_name,
              unitName: estate.unit_name,
              email: estate.family_email,
              phone: estate.family_mobile_number,
            }
          } else {
            this.inputData = [
              {
                id: 'condominium_name',
                formParams: 'nameCondominium',
                name: 'Condominium Name',
                disabledInput: true
              },    {
                id: 'status_owner',
                formParams: 'statusOwner',
                name: 'Status',
                disabledInput: true
              },    {
                id: 'block_name',
                formParams: 'blockName',
                name: 'Block',
                disabledInput: true
              },    {
                id: 'unit_name',
                formParams: 'unitName',
                name: 'Unit',
                disabledInput: true
              },    {
                id: 'email_owner',
                formParams: 'email',
                name: 'Email',
                disabledInput: this.disabledInput
              },    {
                id: 'phone_number',
                formParams: 'phone',
                name: 'Contact',
                disabledInput: this.disabledInput
              }
            ]
            this.inputForm = {
              nameCondominium: estate.project_name,
              statusOwner: estate.family_type,
              blockName: estate.block_name,
              unitName: estate.unit_name,
              email: estate.family_email,
              phone: estate.family_mobile_number,
            }
          }
          if (estate.unit_id) {
            this.activeUnit = estate.unit_id;
          } else {
            this.activeUnit = estate.family_id;
          }
          Preferences.get({key: 'USER_CREDENTIAL'}).then(async (value) => {
            if(value?.value){
              const decodedEstateString = decodeURIComponent(escape(atob(value.value)));
              this.isLoading = true;
              // Mengubah string JSON menjadi objek JavaScript
              const credential = JSON.parse(decodedEstateString);
              this.loadEstate(credential.emailOrPhone);
            }
          })
        }
      })
    })
  }

  ngOnInit() {
    
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  onChangeTypeUser(event: any) {
    this.userType = event;
    if (event === 'industrial') {
      this.squareButton = [
        {
          name: 'Estate',
          src: 'assets/icon/resident-icon/profile/Home.png',
        },    {
          name: 'Ban',
          src: 'assets/icon/resident-icon/profile/No User.webp',
        },{
          name: 'Vehicles',
          src: 'assets/icon/resident-icon/profile/Oncoming Automobile.webp',
        }
      ];
    }
  }

  ableChangeInput() {
    // Toggle the disabledInput state
    this.disabledInput = !this.disabledInput;
  
    // Update the disabledInput for email and phone fields
    this.inputData.forEach(input => {
      if (input.formParams === 'email' || input.formParams === 'phone') {
        input.disabledInput = this.disabledInput;
      }
    });
  
    if (this.disabledInput === true) {
      this.functionMain.presentToast('You can not change your profile data', 'danger');
    } else {
      this.functionMain.presentToast('You can change your profile data now', 'success');
    }
  }

  onClickButton(button?: any, type?: string) {
    console.log('Button clicked:', button, 'Type:', type);
    if (type === 'back') {
      this.pageName = '';
      this.showEstate = false;
      this.showMain = true;
      this.showBanVisitorContractor = false;
      this.showPets = false;
      this.historyData.pop();
    }
  }

  onChangeValueInput(value: any, forWhat: string) {
    if (forWhat === 'condominium_name') {
      this.inputForm.nameCondominium = value;
    } else if (forWhat === 'status_owner') {
      this.inputForm.statusOwner = value;
    } else if (forWhat === 'block_name') {
      this.inputForm.blockName = value;
    } else if (forWhat === 'unit_name') {
      this.inputForm.unitName = value;
    } else if (forWhat === 'email_owner') {
      this.inputForm.email = value;
    } else if (forWhat === 'phone_number') {
      this.inputForm.phone = value;
    }
  }
  
  saveChangeProfile() {
    console.log(this.inputForm);
    
  }

  onClickSquareBottom(event: any) {
    if (event[1] === 'Ban') {
      this.pageName = 'Ban';
      this.showMain = false;
      this.showEstate = false;
      this.showPets = false;
      this.showBanVisitorContractor = true;
      this.getHistoryList();
      if (this.userType === 'industrial') {
        this.getHistoryContrctorList();
      }
    } else if (event[1] === 'Family') {
      this.router.navigate(['/family-page-main'], {
        state: {
          from: "family",
        }
      });
    } else if (event[1] === 'Vehicles') {
      this.router.navigate(['/my-vehicle-page-main'], {
        state: {
          from: "profile",
        }
      });
    } else if (event[1] === 'Employee') {
      this.router.navigate(['/family-page-main'], {
        state: {
          from: "helper",
        }
      });
    } else if (event[1] === 'Estate') {
      this.pageName = 'Choose Estate';
      this.showMain = false;
      this.showPets = false;
      this.showBanVisitorContractor = false;
      this.showEstate = true;
    } else if (event[1] === 'Pets') {
      this.pageName = 'My Pets';
      this.showMain = false;
      this.showEstate = false;
      this.showBanVisitorContractor = false;
      this.showPets = true;
      this.loadPet();
    }
  }

  loadEstate(email:string) {
    this.mainResident.endpointProcess({
      email: email,
    }, 'get/estate').subscribe(
      response => {
        if (response.result.status_code === 200) {
          var listedEstate = []
          for (var key in response.result.response){
            if(response.result.response.hasOwnProperty(key)){
              listedEstate.push({
                family_id: response.result.response[key]?.family_id,
                family_name: response.result.response[key]?.family_name || '',
                family_nickname: response.result.response[key]?.family_nickname || '',
                image_profile: response.result.response[key]?.image_profile || '',
                family_email: response.result.response[key]?.family_email || '',
                family_mobile_number: response.result.response[key]?.family_mobile_number || '',
                family_type: response.result.response[key]?.family_type || '',
                unit_id: response.result.response[key]?.unit_id,
                unit_name: response.result.response[key]?.unit_name || '',
                block_id: response.result.response[key]?.block_id,
                block_name: response.result.response[key]?.block_name || '',
                project_id: response.result.response[key]?.project_id,
                project_name: response.result.response[key]?.project_name || '',
                project_image: response.result.response[key]?.project_image || '',
                record_type: response.result.response[key]?.record_type || ''
              })
            }
          }
          this.profileEstate = listedEstate;
          this.isLoading = false;
        } else {
          console.error('Error fetching Estate:', response);
        }
      },
      error => {
        console.error('HTTP Error:', error);
      }
    );
  }

  async chooseEstateClick(estate: any) {
    // Mengubah estate menjadi string JSON
    const estateString = JSON.stringify(estate);
    // Melakukan encoding ke Base64
    const encodedEstate = btoa(unescape(encodeURIComponent(estateString)));
    this.storage.setValueToStorage('USESATE_DATA', encodedEstate).then((response: any) => {
      this.storage.getValueFromStorage('USESATE_DATA').then((value: any) => {
        this.storage.decodeData(value).then((value: any) => {
          if ( value ) {
            const estate = JSON.parse(value) as Estate;
            this.imageProfile = estate.image_profile;
            this.userName = estate.family_name;
            this.inputForm = {
              nameCondominium: estate.project_name,
              statusOwner: estate.family_type,
              blockName: estate.block_name,
              unitName: estate.unit_name,
              email: estate.family_email,
              phone: estate.family_mobile_number,
            }
            if (estate.unit_id) {
              this.activeUnit = estate.unit_id;
            } else {
              this.activeUnit = estate.family_id;
            }
            Preferences.get({key: 'USER_CREDENTIAL'}).then(async (value) => {
              if(value?.value){
                const decodedEstateString = decodeURIComponent(escape(atob(value.value)));
                this.isLoading = true;
                // Mengubah string JSON menjadi objek JavaScript
                const credential = JSON.parse(decodedEstateString);
                this.loadEstate(credential.emailOrPhone);
              }
            })
          }
        })
        this.webRtcService.initializeSocket();
      })
      if (estate.unit_id) {
        this.activeUnit = estate.unit_id;
      } else {
        this.activeUnit = estate.family_id;
      }
      this.showEstate = false;
      this.showMain = true;
    })
  }

  getHistoryList() {
    this.isLoading = true;
    this.historyData.pop();
    this.mainResident.endpointMainProcess({}, 'get/visitor_history').subscribe((response) => {
      var result = response.result['response_result']
      this.historyData = []
      if (response.result.response_status === 400) {
        this.isLoading = false;
        return;
      } else {
        const bannedItems = result.filter((item: any) => item['is_banned'] === true);
        
        bannedItems.forEach((item: any) => {
          const [entryHours, entryMinutes] = item['entry_time'].split(':').map(Number);
          const entryDate = new Date();
          entryDate.setHours(entryHours, entryMinutes, 0, 0); 
          entryDate.setHours(entryDate.getHours() + 1);
          const exitTime = `${entryDate.getHours().toString().padStart(2, '0')}:${entryDate.getMinutes().toString().padStart(2, '0')}`;
          const visitDate = item['visit_date'] ? item['visit_date'] : new Date();
          const dateParts = visitDate.split('-'); // Misalnya, '2023-10-15' menjadi ['2023', '10', '15']
          const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
      
          this.historyData.push({
            purpose: item['purpose'],
            visitor_name: item['visitor_name'],
            visitor_date: item['visit_date'] ? item['visit_date'] : new Date(),
            visitor_entry_time: item['entry_time'],
            visitor_exit_time: exitTime,
            mode_of_entry: item['mode_of_entry'],
            vehicle_number: item['vehicle_number'],
            point_of_entry: item['point_of_entry'],
            mobile_number: item['contact_number'],
            delivery_type: item['delivery_type'],
            vehicle_type: item['vehicle_type'],
            banned: item['is_banned'],
            id: item['visitor_id']
          });
          this.isLoading = false;
        });
      }
    })
  }

  openDetails(historyData: any) {
    this.router.navigate(['/detail-history-in-visitor'], {
      state: {
        historyData: historyData,
        from: 'profile'
      }
    });
  }

  public async showAlertButtons(headerName: string, className: string, historyData: any) {
    const alertButtons = await this.alertController.create({
      cssClass: className,
      header: headerName + " this visitor?",
      buttons: [
        {
          text: 'Confirm',
          role: 'confirm',
          handler: () => {
            this.reinstateProcess(historyData);
            // console.log(historyData);
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

  reinstateProcess(historyData: any) {
    console.log("tes");
    this.mainResident.endpointMainProcess({
      contact_no: historyData.mobile_number,
      vehicle_number: historyData.vehicle_number
    }, 'post/reinstate_visitor').subscribe(
      (response) => {
        console.log('Success:', response);
        // this.router.navigate(['resident-my-profile']);
        this.getHistoryList();
        this.getHistoryContrctorList();
      },
    )
  }

  getHistoryContrctorList() {
    this.isLoading = true;
    this.filteredData.pop();
    this.mainResident.endpointMainProcess({}, 'get/contractor_history').subscribe((response) => {
      this.isLoading = true; // Set loading to true at the start
      var result = response.result['response_result'];
      
      if (response.result.response_status === 400) {
        this.isLoading = false;
        return;
      } else {
        const bannedItems = result.filter((item: any) => item['is_banned'] === true);

        bannedItems.forEach((item: any) => {
          const [entryHours, entryMinutes] = item['entry_time'].split(':').map(Number);
          const entryDate = new Date();
          entryDate.setHours(entryHours, entryMinutes, 0, 0); 
          entryDate.setHours(entryDate.getHours() + 1);
          const exitTime = `${entryDate.getHours().toString().padStart(2, '0')}:${entryDate.getMinutes().toString().padStart(2, '0')}`;
          
          const visitDate = item['visit_date'] ? item['visit_date'] : new Date();
          const dateParts = visitDate.split('-'); // Misalnya, '2023-10-15' menjadi ['2023', '10', '15']
          const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
  
          this.filteredData.push({
            purpose: item['purpose'],
            visitor_name: item['contractor_name'],
            visitor_date: formattedDate, // Use formattedDate here
            visitor_entry_time: item['entry_time'],
            visitor_exit_time: exitTime,
            mode_of_entry: item['mode_of_entry'],
            vehicle_number: item['vehicle_number'],
            point_of_entry: item['point_of_entry'],
            mobile_number: item['contact_number'],
            delivery_type: item['delivery_type'],
            vehicle_type: item['vehicle_type'],
            banned: item['is_banned'],
            id: item['contractor_id']
          });
        });
      }
      this.isLoading = false; // Set loading to false after processing all items
    });
  }

  loadPet() {
    this.petList = [];
    this.mainResident.endpointMainProcess({}, 'get/pet_registration').subscribe((response: any) => {
      if (response) {
        if (response.result.status === "success") {
          this.petList = response.result.data.map((pet: pet) => ({
            id: pet.id,
            notes: pet.notes,
            pet_breed: pet.pet_breed,
            pet_image: pet.pet_image,
            type_of_pet: pet.type_of_pet,
            upload_license: pet.upload_license,
          }));
        } else {
          this.functionMain.presentToast('Maybe you dont have a registered pet or not approved yet.', 'danger');
        }
        // console.log(response);
      } else {
        this.functionMain.presentToast('Failed to load pet data', 'danger');
      }
    })
  }

  async deletePets(petID: number) {
    const alert = await this.alertController.create({
      cssClass: 'manage-payment-alert',
      header: 'Delete Pet',
      message: 'Are you sure you want to delete this pet?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass:'secondary',
          handler: (blah) => {
            // console.log('Confirm Cancel: blah', blah);
          }
        }, {
          text: 'Delete',
          handler: () => {
            this.deletePetsProses(petID);
          }
        }
      ]
    });
    await alert.present();
  }

  deletePetsProses(petId: number) {
    this.mainResident.endpointMainProcess({
      pet_id: petId,
    }, 'delete/pet_registration').subscribe((response: any) => {
      if (response) {
        if (response.result.status === "success") {
          this.pageName = 'My Pets';
          this.showMain = false;
          this.showEstate = false;
          this.showBanVisitorContractor = false;
          this.showPets = true;
          this.loadPet();
        } else {
          this.functionMain.presentToast('Failed to delete pet data', 'danger');
        }
        // console.log(response);
      } else {
        this.functionMain.presentToast('Failed to load pet data', 'danger');
      }
    })
  }

  navigateToDetailpets(pet: any) {
    this.router.navigate(['pets-detail-for-profile'], {
      state: {
        pet: pet
      }
    })
  }

  toWhere() {
    this.router.navigate(['/pet-registration'], {
      state: {
        from: 'profile'
      }
    })
  }

}
