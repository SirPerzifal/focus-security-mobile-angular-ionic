import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-family-tenant-extend',
  templateUrl: './family-tenant-extend.page.html',
  styleUrls: ['./family-tenant-extend.page.scss'],
})
export class FamilyTenantExtendPage implements OnInit {

  name: string=""
  end_date: string=new Date().toISOString().split('T')[0];

  constructor(private router: Router) {
    // Ambil data dari state jika tersedia
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { name: string, end_date: Date };
    if (state) {
      this.name= state.name
      this.end_date= new Date(state.end_date).toISOString().split('T')[0];
    } 
  }  

  ngOnInit() {
  }

}
