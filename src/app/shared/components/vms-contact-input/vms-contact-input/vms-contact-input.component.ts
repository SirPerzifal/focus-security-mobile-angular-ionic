import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { getCountries, getCountryCallingCode } from 'libphonenumber-js';
import { MainVmsService } from 'src/app/service/vms/main_vms/main-vms.service';

@Component({
  selector: 'app-vms-contact-input',
  templateUrl: './vms-contact-input.component.html',
  styleUrls: ['./vms-contact-input.component.scss'],
})
export class VmsContactInputComponent  implements OnInit {

  constructor(private mainVmsService: MainVmsService, private toastController: ToastController) { }

  @Input() placeholder: string = '';
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

  @Output() valueChange = new EventEmitter<string>();
  @Output() keyupEvent = new EventEmitter<KeyboardEvent>();
  @Output() contactInfo = new EventEmitter<any>();

  getCode() {
    // const countries = getCountries();
    // this.countryCodes = countries.map(country => ({
    //   country: country,
    //   code: `${getCountryCallingCode(country)}`
    // }));
    this.countryCodes = [
      {
        country: 'SG',
        code: '65'
      },
      {
        country: 'ID',
        code: '62'
      },
      {
        country: 'MY',
        code: '60'
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
    const inputValue = (event.target as HTMLInputElement).value;
    this.contactValue = inputValue;
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
    if (!this.isReadonly){
      let params = {
        contact_number: this.combinedValue
      }
      this.mainVmsService.getApi(params, '/vms/get/search_contact_number' ).subscribe({
        next: (results) => {
          if (results.result.status_code === 200) {
            this.presentToast('Succesfully get data!', 'success');
            console.log(results.result.result)
            this.contactInfo.emit(results.result.result)
          } else {
            this.presentToast('Failed to get data!', 'danger');
          }
        },
        error: (error) => {
          this.presentToast('Failed to get data!', 'danger');
          console.error(error);
        }
      });
    }
  }

  async presentToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color
    });

    toast.present().then(() => {
    });
  }

}
