import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-family-edit-member',
  templateUrl: './family-edit-member.page.html',
  styleUrls: ['./family-edit-member.page.scss'],
})
export class FamilyEditMemberPage implements OnInit {

  type: string=""
  name: string=""
  mobile: string=""
  head_type: string=""
  nickname: string=""
  email: string=""
  end_date: Date = new Date()
  tenant: boolean=false
  warning: boolean=false
  full_type: string="Type of Residence"

  constructor(private router: Router) {
    // Ambil data dari state jika tersedia
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { type: string, name: string, mobile: string, head_type: string, nickname: string, email: string, end_date: Date, tenant: boolean, warning: boolean,  };
    if (state) {
      this.full_type = state.head_type == 'Tenant' ? state.head_type : state.head_type + ", " + state.type
      this.type= state.type
      this.name= state.name
      this.mobile= state.mobile
      this.head_type= state.head_type
      this.nickname= state.nickname
      this.email= state.email
      this.end_date= state.end_date
      this.tenant= state.tenant
      this.warning= state.warning
      console.log(this.end_date, this.full_type)
    } 
  }

  openExtend() {
    this.router.navigate(['/family-tenant-extend'], {
      state: {
        name: this.name,
        end_date: this.end_date,
      }
    });
  }

  ngOnInit() {
  }

}
