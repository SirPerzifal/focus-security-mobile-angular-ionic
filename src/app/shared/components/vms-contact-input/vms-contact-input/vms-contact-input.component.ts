import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import { MainVmsService } from 'src/app/service/vms/main_vms/main-vms.service';

@Component({
  selector: 'app-vms-contact-input',
  templateUrl: './vms-contact-input.component.html',
  styleUrls: ['./vms-contact-input.component.scss'],
})
export class VmsContactInputComponent  implements OnInit {

  constructor(private mainVmsService: MainVmsService, private functionMain: FunctionMainService, private storage: StorageService, private cdr: ChangeDetectorRef, private mainApiResidentService: MainApiResidentService) { }

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
  @Input() isMandatory: boolean = false;

  @Output() valueChange = new EventEmitter<string>();
  @Output() keyupEvent = new EventEmitter<KeyboardEvent>();
  @Output() contactInfo = new EventEmitter<any>();
  @Output() codeMinDigit = new EventEmitter<any>();

  initialSelection = '65'

  setDefaultCode(value: any) {
    let tepmSelect = value.substring(0, 2);
    if (this.countryCodes.filter((item: any) => item.code.toString() == tepmSelect.toString()).length > 0) {
      this.selectedCode = tepmSelect
    } else {
      this.selectedCode = value.substring(0, 3);
    }
    this.contactValue = value.substring(this.selectedCode.length);
  }
  
  getCode() {
    this.storage.getValueFromStorage('COUNTRY_CODES_DATA').then((value) => {
      if (value && value.length > 0) {
        this.countryCodes =  value.map((value: any) => {
          return {
            country: value.country,
            code: value.code,
            minDigit: value.min_digit,
            maxDigit: value.max_digit,
          }
        }).sort((a: any, b: any) => {
          // if (a.country === 'SG') return -1;
          // if (b.country === 'SG') return 1;
          return a.country.localeCompare(b.country); // urutan alfabetis untuk yang lain
        });
        this.cdr.detectChanges()
      } else {
        this.mainApiResidentService.endpointCustomProcess({}, '/fs-get-country-code').subscribe((value: any) => {
          console.log(value)
          if (value && value.result.country_code_data.length > 0) {
            this.countryCodes = value.result.country_code_data.map((value: any) => {
              return {
                country: value.country,
                code: value.code,
                minDigit: value.min_digit,
                maxDigit: value.max_digit,
              }
            }).sort((a: any, b: any) => {
              // if (a.country === 'SG') return -1;
              // if (b.country === 'SG') return 1;
              return a.country.localeCompare(b.country); // urutan alfabetis untuk yang lain
            });
            this.cdr.detectChanges()
          }
        })
      }
      setTimeout(() => {
        if (this.valueExist) {
          const cleanedValue = this.valueExist.replace(/\+/g, '');
          if (this.valueExist[0] == '0') {
            this.selectedCode = '65';
            this.contactValue = cleanedValue.substring(1);
          } else {
            this.setDefaultCode(cleanedValue)
          }
          
          this.onChange(this.combinedValue);
          this.valueChange.emit(this.combinedValue);
        }
        this.codeMinDigit.emit(this.countryCodes.filter((item: any) => item.code == this.initialSelection)[0].minDigit)
      
      }, 0);
    })
  }

  countryCodes: any = [
    {
      country: 'SG',
      code: '65',
      maxDigit: 8,
      minDigit: 7,
    },
    {
      country: 'ID',
      code: '62',
      maxDigit: 12,
      minDigit: 7,
    },
    {
      country: 'MY',
      code: '60',
      maxDigit: 9,
      minDigit: 7,
    },
    {
      country: 'IN',
      code: '91',
      maxDigit: 10,
      minDigit: 7,
    },
  ]

  @Input()
  set value(val: string) {
    if(val) {
      const cleanedValue = val.replace(/\+/g, '');
      if (val[0] == '0') {
        this.selectedCode = '65';
        this.contactValue = cleanedValue.substring(1);
      } else {
        this.setDefaultCode(cleanedValue)
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
  }

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  onKeyUp(event: KeyboardEvent): void {
    let code = this.countryCodes.filter((item: any) => item.code == this.selectedCode)[0].maxDigit
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
    let selected = this.countryCodes.filter((item: any) => item.code == this.selectedCode)[0]
    this.valueChange.emit(this.combinedValue);
    this.onChange(this.combinedValue);
  }

  getContactInformation(){
    if (!this.isReadonly && !this.disableButton){
      console.log(this.contactValue)
      if (!this.contactValue) {
        this.functionMain.presentToast('The contact number field is required!', 'danger')
        return
      }
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
              this.functionMain.presentToast('No data found!', 'danger');
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
    this.functionMain.presentToast("Press field below code text to choose country extension code!", 'dark');
  }

  @HostListener('window:resize', [])
  onResize() {
    this.checkScreenSize();
  }

  isSmallScreen = false
  checkScreenSize() {
    this.isSmallScreen = window.innerWidth < (this.isModal ? 800 : 750);
  }

  getSelected() {
    let selected = this.countryCodes.filter((item: any) => item.code == this.initialSelection)[0]
    return `${this.isSmallScreen ? '' : selected.country} +${selected.code}`
  }

}
