import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';

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

  showMain: boolean = true;
  showEstate: boolean = false;

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

  disabledInput: boolean = true;

  //for estate
  profileEstate: Estate[] = [];
  isLoading: boolean = false;
  activeUnit : number = 0;
  noData: boolean = false;

  constructor(
    public functionMain: FunctionMainService,
    private storage: StorageService,
    private router: Router,
    private mainResident: MainApiResidentService
  ) { }

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
    if (event === 'commercial') {
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
      this.showEstate = false;
      this.showMain = true;
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
    console.log(event);
    if (event[1] === 'Ban') {
      this.router.navigate(['/history-in-visitor'], {
        state: {
          from: "ban",
        }
      });
    } else if (event[1] === 'Family') {
      this.router.navigate(['/family-main'], {
        state: {
          from: "profile",
        }
      });
    } else if (event[1] === 'Vehicles') {
      this.router.navigate(['/my-vehicle-main'], {
        state: {
          from: "profile",
        }
      });
    } else if (event[1] === 'Employee') {
      this.router.navigate(['/family-main'], {
        state: {
          from: "helper",
        }
      });
    } else if (event[1] === 'Estate') {
      this.showMain = false;
      this.showEstate = true;
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
}
