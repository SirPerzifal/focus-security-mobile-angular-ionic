import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';

@Component({
  selector: 'app-family-main',
  templateUrl: './family-main.page.html',
  styleUrls: ['./family-main.page.scss'],
})
export class FamilyMainPage implements OnInit {

  fromWhere: boolean = false; //
  stateFill: string = '';
  isLoading: boolean = true;

  familyData = [
    { id: 0, type: '', hard_type: '' ,name: '', mobile: '', nickname: '', email: '', head_type: '', status: '', tenancy_agreement: '', end_date: new Date(), family_photo: '', reject_reason: '', helper_work_permit_expiry_date: new Date()  }
  ];

  constructor(private router: Router, private mainApi: MainApiResidentService) {
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

  handleRefresh(event: any) {
    this.isLoading = true;
    setTimeout(() => {
      this.ionViewWillEnter();
      event.target.complete();
    }, 1000)
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
        reject_reason: '', 
        helper_work_permit_expiry_date: new Date() 
      }
    ];
    this.familyData.pop();
    this.getFamilyList();
  }

  directTo() {
    if (this.fromWhere || this.stateFill === 'helper' || this.stateFill === 'family') {
      this.router.navigate(['/profile-page-main']);
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
              reject_reason: item['reject_reason'],
              helper_work_permit_expiry_date: item['helper_work_permit_expiry_date']
            });
          }
        } else if (this.stateFill === 'family') {
          if (item['member_type'] === 'Primary Contacts' || item['member_hard_type'] === 'primary_contact' || item['member_hard_type'] === 'secondary_contact' || item['member_type'] === 'Secondary Contacts' || item['member_hard_type'] === 'member' || item['member_type'] === 'Member') {
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
              reject_reason: item['reject_reason'],
              helper_work_permit_expiry_date: item['helper_work_permit_expiry_date']
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
            reject_reason: item['reject_reason'],
            helper_work_permit_expiry_date: item['helper_work_permit_expiry_date']
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

  openDetails(data: any) {
    this.router.navigate(['/family-form'], {
      state: {
        for: 'editData',
        id: data.id,
        type: data.type,
        hard_type: data.hard_type,
        name: data.name,
        mobile: data.mobile,
        head_type: data.head_type,
        nickname: data.nickname,
        email: data.email,
        end_date: data.end_date,
        tenant: data.tenant,
        warning: data.warning,
        status: data.status, // Tambahkan ini jika perlu
        profile_image: data.family_photo,
        reject_reason: data.reject_reason,
        helper_work_permit_expiry_date: data.helper_work_permit_expiry_date
      }
    });
  }

  openExtend(data: any) {
    this.router.navigate(['/tenant-extend-page'], {
      state: {
        from: 'family-main',
        id: data.id,
        type: data.type,
        hard_type: data.hard_type,
        name: data.name,
        mobile: data.mobile,
        head_type: data.head_type,
        nickname: data.nickname,
        email: data.email,
        end_date: data.end_date,
        tenant: data.tenant,
        warning: data.warning,
        status: data.status, // Tambahkan ini jika perlu
        profile_image: data.family_photo,
        reject_reason: data.reject_reason,
        from_where: 'card',
        helper_work_permit_expiry_date: data.helper_work_permit_expiry_date
      }
    });
  }

}
