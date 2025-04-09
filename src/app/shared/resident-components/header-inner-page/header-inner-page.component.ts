import { Input, Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

import { StorageService } from 'src/app/service/storage/storage.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { Estate } from 'src/models/resident/resident.model';

@Component({
  selector: 'app-header-inner-page',
  templateUrl: './header-inner-page.component.html',
  styleUrls: ['./header-inner-page.component.scss'],
})
export class HeaderInnerPageComponent  implements OnInit {

  constructor(
    private storage: StorageService,
    public functionMain: FunctionMainService
  ) {}

  @Input() text: string = "";
  @Input() text_second: string = "";
  @Output() typeOfUser = new EventEmitter<any>();
  condoImage: string = '';

  userType: string = '';

  ngOnInit() {
    Preferences.get({key: 'USER_CREDENTIAL'}).then(async (value) => {
      if(value?.value){
        const decodedEstateString = decodeURIComponent(escape(atob(value.value)));
        const credential = JSON.parse(decodedEstateString);
        this.userType = credential.type;
        this.typeOfUser.emit(this.userType)
      }
    })
    this.storage.getValueFromStorage('USESATE_DATA').then((value: any) => {
      if ( value ) {
        this.storage.decodeData(value).then((value: any) => {
          if ( value ) {
            const estate = JSON.parse(value) as Estate;
            this.condoImage = estate.project_image;
          }
        })
      } 
    })
  }

}
