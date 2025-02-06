import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { AuthService } from 'src/app/service/resident/authenticate/authenticate.service';

@Component({
  selector: 'app-my-profile-estate',
  templateUrl: './my-profile-estate.page.html',
  styleUrls: ['./my-profile-estate.page.scss'],
})
export class MyProfileEstatePage implements OnInit {

  profileEstate: {
    family_id : number,
    family_name : string,
    family_type:string,
    unit_id : number,
    unit_name : string,
    block_id : number,
    block_name : string,
    project_id : number,
    project_name : string,
  }[] = [];
  activeUnit : number = 0;

  constructor(
    private authService : AuthService
  ) { }

  ngOnInit() {
    Preferences.get({key:'ACTIVE_UNIT'}).then((unit_value)=>{
      if(unit_value?.value){
        this.activeUnit = parseInt(unit_value.value)
      }
    })
    Preferences.get({key:'USER_INFO'}).then((value)=>{
      if(value?.value){
        var accessToken = this.authService.parseJWTParams(value.value)
        console.log(accessToken);
        console.log('accessTokenaccessTokenaccessTokenaccessTokenaccessToken');
        this.loadEstate(accessToken?.email)
        
        // this.authService.getEstatesByEmail(accessToken?.email).subscribe(
        
        
      }else{
        this.loadEstate('jenvel@gmail.com')
      }
    })

  }

  loadEstate(email:string) {
    this.authService.getEstatesByEmail(email).subscribe(
          
      response => {
        console.log(response,"responseresponseresponseresponseresponseresponse");
        if (response.result.status_code === 200) {
          console.log("heres the data", response);
          var listedEstate = []
          for (var key in response.result.response){
            if(response.result.response.hasOwnProperty(key)){
              listedEstate.push({
                family_id : response.result.response[key]?.family_id,
                family_name : response.result.response[key]?.family_name ? response.result.response[key]?.family_name : '',
                family_type:response.result.response[key]?.family_type ? response.result.response[key]?.family_type : '',
                unit_id : response.result.response[key]?.unit_id,
                unit_name : response.result.response[key]?.unit_name ? response.result.response[key]?.unit_name : '',
                block_id : response.result.response[key]?.block_id,
                block_name : response.result.response[key]?.block_name ? response.result.response[key]?.block_name : '',
                project_id : response.result.response[key]?.project_id,
                project_name : response.result.response[key]?.project_name ? response.result.response[key]?.project_name : '',
              })
            }
          }
          this.profileEstate = listedEstate
          console.log(this.profileEstate);
          console.log('this.profileEstatethis.profileEstatethis.profileEstatethis.profileEstatethis.profileEstatethis.profileEstatethis.profileEstate');
          
          // this.profileEstate = response.result.result
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
    await Preferences.set({
      key: 'ACTIVE_UNIT',
      value: estate.unit_id.toString(),
    })
    await Preferences.set({
      key: 'ACTIVE_FAMILY',
      value: estate.family_id.toString(),
    })
    await Preferences.set({
      key: 'ACTIVE_PROJECT',
      value: estate.project_id.toString(),
    })
    await Preferences.set({
      key: 'PROJECT_NAME',
      value: estate.project_name.toString(),
    })
    await Preferences.set({
      key: 'FAMILY_TYPE',
      value: estate.family_type,
    })
    this.activeUnit = estate.unit_id

    // Preferences.get({key:'USER_INFO'}).then((value)=>{
    //   if(value?.value){
    //     var accessToken = this.authService.parseJWTParams(value.value)
    //     console.log(accessToken);
    //     console.log('accessTokenaccessTokenaccessTokenaccessTokenaccessToken');
    //     this.loadEstate('jenvel@gmail.com')
        
    //     // this.authService.getEstatesByEmail(accessToken?.email).subscribe(
        
        
    //   }
    // })
  }
}
