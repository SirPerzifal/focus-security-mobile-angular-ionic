import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { FamilyService } from 'src/app/service/resident/family/family.service';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';

@Component({
  selector: 'app-resident-my-family',
  templateUrl: './resident-my-family.page.html',
  styleUrls: ['./resident-my-family.page.scss'],
})
export class ResidentMyFamilyPage implements OnInit, OnDestroy {

  isModalFamilyEditOpen: boolean = false; // Status modal
  fromWhere: boolean = false; //
  unitId: number = 0;
  stateFill: string = '';
  isLoading: boolean = true;

  constructor(private familyService: FamilyService, private router: Router, private mainApi: MainApiResidentService) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { from: any};
    if (state) {
      // // console.log(state.from);
      this.fromWhere = true
      this.stateFill = state.from;
    } 
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.familyData = [
      { 
        id: 0, 
        type: '', 
        hard_type: '' ,
        name: '', 
        mobile: '', 
        nickname: '', 
        email: '', 
        head_type: '', 
        status: '', 
        tenancy_agreement: '', 
        end_date: new Date(), 
        family_photo: '', 
        reject_reason: '' 
      }
    ];
    this.familyData.pop();
    this.getFamilyList();
  }

  familyData = [
    { id: 0, type: '', hard_type: '' ,name: '', mobile: '', nickname: '', email: '', head_type: '', status: '', tenancy_agreement: '', end_date: new Date(), family_photo: '', reject_reason: '' }
  ];

  directTo() {
    if (this.fromWhere || this.stateFill === 'helper') {
      this.router.navigate(['/resident-my-profile']);
    }
     else {
      this.router.navigate(['/resident-home-page']);
    }
  }

  getFamilyList() {
    this.familyData.pop();
    this.mainApi.endpointMainProcess({}, 'get/get_family').subscribe((response: any) => {
      var result = response.result['response_result'];
      result.forEach((item: any) => {
        // Cek apakah stateFill ada
        if (this.stateFill === 'helper') {
          // Hanya tambahkan item jika member_type atau member_hard_type adalah 'helper'
          if (item['member_type'] === 'Helper' || item['member_hard_type'] === 'helper') {
            this.familyData.push({
              id: item['family_id'], 
              type: item['member_type'], 
              hard_type: item['member_hard_type'], 
              name: item['family_full_name'], 
              mobile: item['family_mobile_number'], 
              nickname: item['family_nickname'], 
              email: item['family_email'], 
              head_type: item['member_hard_type'] == 'tenants' ? 'Tenants' : 'Family',
              end_date: item['end_of_tenancy_aggrement'],
              status: item['states'],
              tenancy_agreement: item['tenancy_aggrement'],
              family_photo: item['family_photo'],
              reject_reason: item['reject_reason']
            });
          }
        } else {
          // Jika stateFill tidak ada, tambahkan semua item
          this.familyData.push({
            id: item['family_id'], 
            type: item['member_type'], 
            hard_type: item['member_hard_type'], 
            name: item['family_full_name'], 
            mobile: item['family_mobile_number'], 
            nickname: item['family_nickname'], 
            email: item['family_email'], 
            head_type: item['member_hard_type'] == 'tenants' ? 'Tenants' : 'Family',
            end_date: item['end_of_tenancy_aggrement'],
            status: item['states'],
            tenancy_agreement: item['tenancy_aggrement'],
            family_photo: item['family_photo'],
            reject_reason: item['reject_reason']
          });
        }
      });
      if (this.familyData) {
        this.isLoading = false;
      }
    })
    // // console.log(this.stateFill);
    // console.log("tes", this.familyData);
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    // Bersihkan subscription untuk menghindari memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

}
