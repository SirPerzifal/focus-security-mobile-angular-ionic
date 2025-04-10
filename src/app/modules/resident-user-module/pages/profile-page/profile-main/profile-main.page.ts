import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';

import { StorageService } from 'src/app/service/storage/storage.service';
import { Estate } from 'src/models/resident/resident.model';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

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

  imageProfile: string = '';
  userName: string = '';
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
      name: 'Ban Visitor',
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

  constructor(
    public functionMain: FunctionMainService,
    private storage: StorageService,
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
        }
      })
    })
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
    
  }
}
