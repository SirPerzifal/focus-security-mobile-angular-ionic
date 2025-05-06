import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faBarcode } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { MainVmsService } from 'src/app/service/vms/main_vms/main-vms.service';

@Component({
  selector: 'app-nric-scan-input',
  templateUrl: './nric-scan-input.component.html',
  styleUrls: ['./nric-scan-input.component.scss'],
})
export class NricScanInputComponent  implements OnInit {

  constructor(
    public functionMain: FunctionMainService,
    private mainVmsService: MainVmsService,
  ) { }

  ngOnInit() {
    this.functionMain.vmsPreferences().then((value) => {
      this.project_id = value.project_id
    })
  }

  @Input() selectedIdentification: string = '';
  @Input() isReadonly: boolean = false
  @Input() includePassport: boolean = false
  @Output() outputScan = new EventEmitter<any>();

  @Input() parentClass: string = '';
  @Input() showSelection: boolean = false;
  @Input() isScan: boolean = true

  onSelectionChange(event: any) {
    this.selectedIdentification = event.target.value
    if ((this.selectedIdentification == 'nric' || this.selectedIdentification == 'fin') && this.temp_type == 'passport') {
      this.nric_value = ''
    }
    if ((this.temp_type == 'nric' || this.temp_type == 'fin') && this.selectedIdentification == 'passport') {
      this.nric_value = ''
    }
    this.returnOutput()
    this.temp_type = event.target.value
  }

  onPassportChange(event: any) {
    console.log(event.target.value)
    this.nric_value = event.target.value
    this.data = {is_server: false, identification_number: this.nric_value}
    this.returnOutput()
  }

  icon: IconDefinition = faBarcode
  temp_type = ''
  nric_value = ''
  project_id = 0

  data: any = {is_server: false, identification_number: ''}

  openNricScan() {
    this.functionMain.presentModalNric().then(value => {
      if (value) {
        console.log(value)
        this.selectedIdentification = value.is_fin ? 'fin' : 'nric'
        this.temp_type = this.selectedIdentification
        this.nric_value = value.data;
        if (!this.isScan) {
          this.data = {identification_number: this.nric_value, is_server: false}
          return
        }
        this.mainVmsService.getApi({nric: value.data, project_id: this.project_id, is_visitor_logs: true}, '/vms/get/contractor_by_nric').subscribe({
          next: (results) => {
            console.log(results)
            if (results.result.status_code === 200) {
              this.data = {...results.result.result[0], is_server: true}
              this.returnOutput()
            } else {
              this.data = {identification_number: this.nric_value, is_server: false}
              this.returnOutput()
              this.functionMain.presentToast(`No data found in the system for ${value.data}!`, 'warning')
            }
          },
          error: (error) => {
            this.functionMain.presentToast('An error occurred while searching for nric!', 'danger');
            console.error(error);
          }
        });
      }
      
    });
    console.log(this.nric_value)
  }

  returnOutput() {
    this.outputScan.emit({data: this.data, type: this.selectedIdentification});
  }

  @Input()
  set Selected(value: any) {
    console.log(value)
    if (value) {
      this.nric_value = value.number
      this.selectedIdentification = value.type
      this.temp_type = value.type
      this.data = {is_server: false, identification_number: this.nric_value}
    } else {
      this.nric_value = ''
      this.selectedIdentification = ''
      this.data = {is_server: false, identification_number: ''}
    }
    this.returnOutput()
  }

}
