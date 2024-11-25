import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-family-card',
  templateUrl: './family-card.component.html',
  styleUrls: ['./family-card.component.scss'],
})
export class FamilyCardComponent  implements OnInit {

  constructor(private router: Router) { }

  @Input() type: string=""
  @Input() name: string=""
  @Input() mobile: string=""
  @Input() head_type: string=""
  @Input() nickname: string=""
  @Input() email: string=""
  @Input() end_date: Date=new Date()
  @Input() tenant: boolean=false
  @Input() warning: boolean=false

  ngOnInit() {}

  openDetails() {
    this.router.navigate(['/family-edit-member'], {
      state: {
        type: this.type,
        name: this.name,
        mobile: this.mobile,
        head_type: this.head_type,
        nickname: this.nickname,
        email: this.email,
        end_date: this.end_date,
        tenant: this.tenant,
        warning: this.warning,
      }
    });
  }

}
