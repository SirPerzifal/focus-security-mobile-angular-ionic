import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vms-header',
  templateUrl: './vms-header.component.html',
  styleUrls: ['./vms-header.component.scss'],
})
export class VmsHeaderComponent  implements OnInit {

  constructor(private router: Router) { }

  @Input() urlCustom: string = '/home-vms'; 
  @Input() homeRoute: boolean = false; 
  @Input() params: any = false
  @Input() customBack: boolean = false

  ngOnInit() {
  }

  onRouterClick() {
    console.log(this.params)
    if (!this.customBack) {
      if (!this.params){
        this.router.navigate([this.urlCustom])
      } else {
        this.router.navigate([this.urlCustom], {queryParams: this.params})
      }
    }
    
    
  }

  onHomeClick() {
    this.router.navigate(['/home-vms'])
  }

}
