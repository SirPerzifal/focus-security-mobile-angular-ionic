import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { AuthService } from 'src/app/service/resident/authenticate/authenticate.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { EstateProfile } from 'src/models/resident/auth.model';

@Component({
  selector: 'app-my-profile-estate',
  templateUrl: './my-profile-estate.page.html',
  styleUrls: ['./my-profile-estate.page.scss'],
})
export class MyProfileEstatePage implements OnInit {

  profileEstate: EstateProfile[] = [];
  activeUnit : number = 0;
  isLoading: boolean = true;

  constructor(
    private authService : AuthService,
    public functionMain: FunctionMainService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    Preferences.get({key: 'USESTATE_DATA'}).then(async (value) => {
      if (value?.value) {
        const parseValue = JSON.parse(value.value);
        this.activeUnit = parseValue.unit_id;
      }
    })
    Preferences.get({key: 'USER_EMAIL'}).then(async (value) => {
      if (value?.value) {
        this.loadEstate(value.value);
      }
    })
    Preferences.get({key: 'USER_MOBILE'}).then(async (value) => {
      if (value?.value) {
        this.loadEstate(value.value);
      }
    })
  }

  loadEstate(email:string) {
    console.log(email)
    this.authService.getEstatesByEmail(email).subscribe(
      response => {
        if (response.result.status_code === 200) {
          var listedEstate = []
          for (var key in response.result.response){
            if(response.result.response.hasOwnProperty(key)){
              listedEstate.push({
                family_id: response.result.response[key]?.family_id,
                family_name: response.result.response[key]?.family_name || '',
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

  async chooseEstateClick(estate:any){
    Preferences.set({
      key: 'USESTATE_DATA',
      value: JSON.stringify(estate),
    }).then(()=>{
      this.activeUnit = estate.unit_id;
      this.router.navigate(['/resident-home-page']);
    });
  }
}
