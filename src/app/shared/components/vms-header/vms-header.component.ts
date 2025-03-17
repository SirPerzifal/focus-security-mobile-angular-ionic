import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-vms-header',
  templateUrl: './vms-header.component.html',
  styleUrls: ['./vms-header.component.scss'],
})
export class VmsHeaderComponent  implements OnInit {

  constructor(private router: Router, public functionMain: FunctionMainService) { }

  @Input() urlCustom: string = '/home-vms'; 
  @Input() homeRoute: boolean = false; 
  @Input() params: any = false
  @Input() customBack: boolean = false
  @Input() isRefresh: boolean = false
  @Output() refreshClicked = new EventEmitter<boolean>()

  ngOnInit() {
    this.loadProjectName()
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

  async loadProjectName() {
    await this.functionMain.vmsPreferences().then((value) => {
      this.project_name = value.project_name.toUpperCase()
    })
  }
  project_name = ''

  onHomeClick() {
    this.router.navigate(['/home-vms'])
  }

  refreshClick(){
    this.refreshClicked.emit(true)
  }

}
