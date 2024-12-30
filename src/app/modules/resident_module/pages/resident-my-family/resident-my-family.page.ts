import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FamilyService } from 'src/app/service/resident/family/family.service';

@Component({
  selector: 'app-resident-my-family',
  templateUrl: './resident-my-family.page.html',
  styleUrls: ['./resident-my-family.page.scss'],
})
export class ResidentMyFamilyPage implements OnInit {

  constructor(private familyService: FamilyService, private router: Router) { }

  familyData = [
    { id: 0, type: '', hard_type: '' ,name: '', mobile: '', nickname: '', email: '', head_type: '', status: '', tenancy_agreement: '', end_date: new Date() }
  ];

  getFamilyList() {
    this.familyData.pop()
    this.familyService.getFamilyList().subscribe(
      res => {
        var result = res.result['response_result']
        console.log(result)
        result.forEach((item: any) => {
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
            tenancy_agreement: item['tenancy_aggrement'] });
        });
      },
      error => {
        console.log(error)
      }
    )
    console.log("tes", this.familyData)
  }

  ngOnInit() {
    console.log("WORK")
    this.getFamilyList()

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (event['url'] == '/resident-my-family'){
          this.familyData = []
          this.getFamilyList();
        }
         // Panggil fungsi lagi saat halaman dibuka
      }
    });
  
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    // Bersihkan subscription untuk menghindari memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

}
