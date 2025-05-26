import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { ToastController } from '@ionic/angular';
import { getCountries, getCountryCallingCode } from 'libphonenumber-js';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { MainVmsService } from 'src/app/service/vms/main_vms/main-vms.service';

@Component({
  selector: 'app-vms-contact-input',
  templateUrl: './vms-contact-input.component.html',
  styleUrls: ['./vms-contact-input.component.scss'],
})
export class VmsContactInputComponent  implements OnInit {

  constructor(private mainVmsService: MainVmsService, private toastController: ToastController, private functionMain: FunctionMainService) { }

  @Input() placeholder: string = '821 7263 112';
  @Input() labelText: string = '';
  @Input() id: string = '';
  @Input() name: string = '';
  @Input() isReadonly: boolean = false;
  @Input() selectedCode: string = '65';
  @Input() contactValue: string = '';
  @Input() vmsPage: boolean = true;
  @Input() inputClass: string = '';
  @Input() labelClass: string = '';
  @Input() contactLabel: string = '';
  @Input() valueExist: string = '';
  @Input() disableButton: boolean = false
  @Input() showButton: boolean = true
  @Input() isModal: boolean = false

  @Output() valueChange = new EventEmitter<string>();
  @Output() keyupEvent = new EventEmitter<KeyboardEvent>();
  @Output() contactInfo = new EventEmitter<any>();

  getCode() {
    this.countryCodes = [
      {
        country: 'SG',
        code: '65',
        digit: 8,
      },
      {
        country: 'ID',
        code: '62',
        digit: 12,
      },
      {
        country: 'MY',
        code: '60',
        digit: 9,
      },
    ]
  }

  countryCodes: any = []

  @Input()
  set value(val: string) {
    if(val) {
      const cleanedValue = val.replace(/\+/g, '');
      if (val[0] == '0') {
        this.selectedCode = '65';
        this.contactValue = cleanedValue.substring(1);
      } else {
        this.selectedCode = cleanedValue.substring(0, 2);
        this.contactValue = cleanedValue.substring(2);
      }
      this.onChange(this.combinedValue);
      this.valueChange.emit(this.combinedValue);
    }
    
  }

  get value(): string {
    return this.combinedValue;
  }

  get combinedValue(): string {
    return `${this.selectedCode}${this.contactValue}`.trim();
  }
  

  ngOnInit() {
    this.isSmallScreen = window.innerWidth < (this.isModal ? 750 : 570);
    this.getCode()
    setTimeout(() => {
      if (this.valueExist) {
        const cleanedValue = this.valueExist.replace(/\+/g, '');
        if (this.valueExist[0] == '0') {
          this.selectedCode = '65';
          this.contactValue = cleanedValue.substring(1);
        } else {
          this.selectedCode = cleanedValue.substring(0, 2);
          this.contactValue = cleanedValue.substring(2);
        }
        
        this.onChange(this.combinedValue);
        this.valueChange.emit(this.combinedValue);
      }
    
    }, 0);
  }

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  onKeyUp(event: KeyboardEvent): void {
    let code = this.countryCodes.filter((item: any) => item.code == this.selectedCode)[0].digit
    const inputValue = (event.target as HTMLInputElement).value;
    if (inputValue.length > code) {
      this.contactValue = inputValue.slice(0, code)
      this.functionMain.presentToast(`Contact number must not be more than ${code} digits`, 'danger')
    } else {
      this.contactValue = inputValue;
    }
    this.keyupEvent.emit(event);
    this.valueChange.emit(this.combinedValue);
    this.onChange(this.combinedValue);
  }

  onCountryCodeChange(event: Event): void {
    this.selectedCode = (event.target as HTMLSelectElement).value;
    this.valueChange.emit(this.combinedValue);
    this.onChange(this.combinedValue);
  }

  getContactInformation(){
    if (!this.isReadonly && !this.disableButton){
      this.functionMain.vmsPreferences().then((value) => {
        let params = {
          contact_number: this.combinedValue,
          project_id: value.project_id
        }
        this.mainVmsService.getApi(params, '/vms/get/search_contact_number' ).subscribe({
          next: (results) => {
            if (results.result.status_code === 200) {
              this.functionMain.presentToast('Succesfully get data!', 'success');
              console.log(results.result.result)
              this.contactInfo.emit(results.result.result)
            } else {
              this.functionMain.presentToast('Failed to get data!', 'danger');
            }
          },
          error: (error) => {
            this.functionMain.presentToast('Failed to get data!', 'danger');
            console.error(error);
          }
        });
      })
    }
  }

   faQuestion = faQuestionCircle

  showMessage() {
    this.functionMain.presentToast("Press field below code to choose country extension code!", 'dark');
  }

  @HostListener('window:resize', [])
  onResize() {
    this.checkScreenSize();
  }

  isSmallScreen = false
  checkScreenSize() {
    this.isSmallScreen = window.innerWidth < (this.isModal ? 750 : 570);
  }

}
