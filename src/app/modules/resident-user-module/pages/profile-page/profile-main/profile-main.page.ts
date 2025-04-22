import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { AlertController } from '@ionic/angular';

import { StorageService } from 'src/app/service/storage/storage.service';
import { Estate } from 'src/models/resident/resident.model';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';

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
export class ProfileMainPage implements OnInit {

  pageName: string = '';
  showMain: boolean = true;
  showEstate: boolean = false;
  showBanVisitorContractor: boolean = false;

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
      name: 'Condominium Name'
    },    {
      id: 'status_owner',
      formParams: 'statusOwner',
      name: 'Status'
    },    {
      id: 'block_name',
      formParams: 'blockName',
      name: 'Block'
    },    {
      id: 'unit_name',
      formParams: 'unitName',
      name: 'Unit'
    },    {
      id: 'email_owner',
      formParams: 'email',
      name: 'Email'
    },    {
      id: 'phone_number',
      formParams: 'phone',
      name: 'Contact'
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

  // navButtonsMain: any[] = [
  //   {
  //     text: 'Daily Invite',
  //     active: false,
  //     action: 'route',
  //     routeTo: '/visitor-main'
  //   },
  //   {
  //     text: 'Hired Car',
  //     active: false,
  //     action: 'route',
  //     routeTo: '/hired-card-in-visitor'
  //   },
  //   {
  //     text: 'History',
  //     active: true,
  //     action: 'route',
  //     routeTo: '/hired-card-in-visitor'
  //   },
  // ]

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

  constructor(
    public functionMain: FunctionMainService,
    private storage: StorageService,
    private router: Router,
    private mainResident: MainApiResidentService,
    private alertController: AlertController
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { openBan: boolean };
    if (state) {
      this.pageName = 'Ban'
      this.showMain = false;
      this.showEstate = false;
      this.showBanVisitorContractor = true;
      this.getHistoryList();
      if (this.userType) {
        this.getHistoryContrctorList();
      }
    }
  }

  ngOnInit() {
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
          this.activeUnit = estate.unit_id;
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
    this.disabledInput = !this.disabledInput;
    if (this.disabledInput === true) {
      this.functionMain.presentToast('You can not change your profile data', 'danger');
      return;
    }
    this.functionMain.presentToast('You can change your profile data now', 'success');
  }

  onClickButton(button?: any, type?: string) {
    console.log('Button clicked:', button, 'Type:', type);
    if (type === 'back') {
      this.pageName = '';
      this.showEstate = false;
      this.showMain = true;
      this.showBanVisitorContractor = false;
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
      this.pageName = 'Ban'
      this.showMain = false;
      this.showEstate = false;
      this.showBanVisitorContractor = true;
      this.getHistoryList();
      if (this.userType) {
        this.getHistoryContrctorList();
      }
    } else if (event[1] === 'Family') {
      this.router.navigate(['/resident-my-family'], {
        state: {
          from: "profile",
        }
      });
    } else if (event[1] === 'Vehicles') {
      this.router.navigate(['/resident-my-vehicle'], {
        state: {
          from: "profile",
        }
      });
    } else if (event[1] === 'Employee') {
      this.router.navigate(['/resident-my-family'], {
        state: {
          from: "helper",
        }
      });
    } else if (event[1] === 'Estate') {
      this.pageName = 'Choose Estate'
      this.showMain = false;
      this.showEstate = true;
      this.showBanVisitorContractor = false;
    } else if (event[1] === 'Pets') {
      this.router.navigate(['/my-profile-my-pets']);
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
            this.activeUnit = estate.unit_id;
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
      this.activeUnit = estate.unit_id;
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
      },
    )
  }

  getHistoryContrctorList() {
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
}
