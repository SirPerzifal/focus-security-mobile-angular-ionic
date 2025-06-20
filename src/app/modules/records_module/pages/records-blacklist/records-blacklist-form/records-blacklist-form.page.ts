import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';

@Component({
  selector: 'app-records-blacklist-form',
  templateUrl: './records-blacklist-form.page.html',
  styleUrls: ['./records-blacklist-form.page.scss'],
})
export class RecordsBlacklistFormPage implements OnInit {

  constructor(
    private blockUnitService: BlockUnitService,
    private router: Router,
    private clientMainService: ClientMainService,
    public functionMain: FunctionMainService) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { record: any[], is_ban_record: boolean, type: string, is_ban_notice: boolean, ban_type: string };
    this.loadProjectName().then(() => {
      if (state) {
        this.unitShow = false
        this.record = state.record
        console.log(this.record)
        this.choosenBlock = this.record.block_id
        this.visitor_type = state.type
        this.is_ban_visitor = state.is_ban_record
        this.is_ban_notice = state.is_ban_notice
        this.is_readonly = true
        this.hide_vehicle = state.ban_type == 'visitor'
        if (this.record.industrial_host_id) {
          this.loadHost().then(() => {
            console.log(this.Host)
            setTimeout(() => {
              this.contactHost = this.record.industrial_host_id
              this.selectedHost = this.record.industrial_host_id
              console.log(this.contactHost)
            }, 300)
            this.formData = {
              reason: '',
              block_id: '',
              unit_id: '',
              contact_no: this.record.contact_number,
              vehicle_no: this.record.vehicle_number,
              visitor_name: this.record.visitor_name ? this.record.visitor_name : this.record.offender_name,
              last_entry_date_time: this.record.entry_datetime,
              ban_image: '',
              banned_by: '',
              project_id: this.formData.project_id
            }
            console.log(this.formData)
          })
        }
        this.loadUnit().then(() => {
          console.log("TEEESSS")
          this.contactUnit = this.record.unit_id
          this.formData = {
            reason: '',
            block_id: this.record.block_id,
            unit_id: this.record.unit_id,
            contact_no: this.record.contact_number,
            vehicle_no: this.record.vehicle_number,
            visitor_name: this.record.visitor_name ? this.record.visitor_name : this.record.offender_name,
            last_entry_date_time: this.record.entry_datetime,
            ban_image: '',
            banned_by: '',
            project_id: this.formData.project_id
          }
        })        
      } else {
        this.unitShow = true
        this.refreshVehicle()
      }
    })
  }

  record: any
  is_ban_visitor = false
  is_ban_notice = false
  is_readonly = false
  visitor_type = 'visitor'
  unitShow = true
  hide_vehicle = false

  ngOnInit() {
    this.loadProjectName().then(() => {
      if (this.project_config.is_industrial) {
        this.loadHost()
      } else {
        this.loadBlock()
      }
    })
  }

  async loadProjectName() {
    await this.functionMain.vmsPreferences().then((value) => {
      this.project_name = value.project_name.toUpperCase()
      this.project_id = value.project_id
      this.project_config = value.config
      this.formData.project_id = value.project_id
    })
  }
  project_name = ''
  project_id = 0
  project_config: any = []

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  onBlockChange(event: any) {
    this.formData.block_id = event.target.value;
    this.choosenBlock = event.target.value
    this.Unit = []
    this.loadUnit()
    console.log(this.formData.block_id)
  }

  onUnitChange(event: any) {
    this.formData.unit_id = event.target.value;
    console.log(this.formData.unit_id)
  }

  onUnitChangeNew(event: any) {
    this.formData.unit_id = event[0]
  }

  Block: any[] = [];
  Unit: any[] = [];
  UnitNew: any[] = [];

  loadBlock() {
    console.log('hey this is block')
    this.blockUnitService.getBlock().subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Block = response.result.result;
          console.log(response)
        } else {
        }
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
    console.log(this.Block)
  }

  choosenBlock = ''

  async loadUnit() {
    this.formData.unit_id = ''
    this.loadProjectName().then(() => {
      if (this.project_config.is_industrial) return
      this.blockUnitService.getUnit(this.choosenBlock).subscribe({
        next: (response: any) => {
          if (response.result.status_code === 200) {
            this.Unit = response.result.result; // Simpan data unit
            this.UnitNew = response.result.result.map((item: any) => ({id: item.id, name: item.unit_name}))
            console.log(response)
          } else {
            console.error('Error:', response.result);
          }
        },
        error: (error) => {
          console.error('Error:', error.result);
        }
      });
    })
  }

  refreshVehicle(is_click: any = false) {
    if (this.is_readonly) return
    if ((!this.is_ban_visitor && !this.is_ban_notice) || !this.record.vehicle_number ){
      this.functionMain.getLprConfig(this.project_id).then((value) => {
        console.log(value)
        this.formData.vehicle_no = value.vehicle_number ? value.vehicle_number : ''
        if (!is_click) {
          this.formData.contact_no = value.contact_number ? value.contact_number : ''
          this.formData.visitor_name = value.visitor_name ? value.visitor_name  : ''
          this.contactUnit = ''
          this.contactHost = ''
          if (this.project_config.is_industrial) {
            this.contactHost = value.industrial_host_id ? value.industrial_host_id : ''
          } else {
            if (value.block_id) {
              this.formData.block_id = value.block_id
              this.loadUnit().then(() => {
                setTimeout(() => {
                  this.contactUnit = value.unit_id
                }, 300)
              })
            }
          }
        }
      })
    }
  }

  saveRecord() {
    let errMsg = ''
    if (!this.formData.visitor_name && !this.is_ban_visitor) {
      errMsg += 'Visitor name is required! \n'
    }
    // if (!this.formData.vehicle_no) {
    //   errMsg += 'Visitor vehicle number is required! \n'
    // }
    if (!this.formData.contact_no && !this.is_ban_visitor) {
      errMsg += 'Visitor contact number is required! \n'
    }
    if (this.formData.contact_no  && !this.is_ban_visitor) {
      if (this.formData.contact_no.length <= 2 ) {
        errMsg += 'Contact number is required! \n'
      }
    }
    if (!this.formData.reason) {
      errMsg += 'Reason of ban is required! \n'
    }
    if ((!this.formData.block_id || !this.formData.unit_id) && !this.project_config.is_industrial) {
      errMsg += 'Block and unit must be selected! \n'
    }
    if ((!this.selectedHost) && this.project_config.is_industrial) {
      errMsg += 'Host must be selected! \n'
    }
    // if (!this.formData.ban_image) {
    //   errMsg += 'Ban image is required! \n'
    // }
    if (!this.formData.banned_by) {
      errMsg += 'Issue officer is required! \n'
    }
    if (errMsg != ''){
      this.functionMain.presentToast(errMsg, 'danger')
    } else {
      console.log("SAVE")
      let tempDate = new Date().toISOString().split('T')
      this.formData.last_entry_date_time = this.formData.last_entry_date_time ? this.formData.last_entry_date_time : tempDate[0] + ' ' + tempDate[1].split('.')[0]
      let params = {...this.formData, host: this.selectedHost}
      console.log(params)
      this.clientMainService.getApi(params, '/resident/post/ban_visitor').subscribe({
        next: (results) => {
          console.log(results)
          if (results.result.response_status === 200) {
            this.functionMain.presentToast('Successfully create blacklist data!', 'success');
            this.onBackMove()
          } else {
            this.functionMain.presentToast('An error occurred while submitting blacklist data!', 'danger');
          }
        },
        error: (error) => {
          this.functionMain.presentToast('An error occurred while submitting blacklist data!', 'danger');
          console.error(error);
        }
      });
    }
  }

  contactUnit = ''
  getContactInfo(contactData: any) {
    if (!this.is_ban_visitor && !this.is_ban_notice) {
      this.contactHost = ''
      this.contactUnit = ''
      if (contactData) {
        this.formData.visitor_name = contactData.visitor_name ? contactData.visitor_name  : ''
        this.formData.vehicle_no = contactData.vehicle_number ? contactData.vehicle_number  : ''
        if (this.project_config.is_industrial) {
          this.contactHost = contactData.industrial_host_id ? contactData.industrial_host_id : ''
        } else {
          if (contactData.block_id) {
            this.formData.block_id = contactData.block_id
            this.loadUnit().then(() => {
              this.contactUnit = contactData.unit_id
            })
          }
        }
      }
    }
    
  }

  formData = {
    reason: '',
    block_id: '',
    unit_id: '',
    contact_no: '',
    vehicle_no: '',
    visitor_name: '',
    last_entry_date_time: '',
    ban_image: '',
    banned_by: '',
    project_id: 0,
  };

  onBackMove() {
    console.log(this.record)
    if (this.is_ban_notice) {
      this.router.navigate(['/records-warning-history'], {
        state: {
          vehicle: this.record
        },
        queryParams: {
          type: this.visitor_type
        }
      })
    } else if (this.is_ban_visitor) {
      this.router.navigate(['/records-visitor-detail'], {
        state: {
          logs: this.record
        },
        queryParams: {
          type: this.visitor_type
        }
      })
    } else {
      this.router.navigate(['/records-blacklist'], { queryParams: { reload: true } })
    }
  }

  onBanImage(file: any): void {
    if (file) {
      let data = file;
      this.formData.ban_image = data.image
    }
    // if (data){
    //   this.convertToBase64(data).then((base64: string) => {
    //     console.log('Base64 successed');
    //     this.formData.ban_image = base64.split(',')[1]
    //   }).catch(error => {
    //     console.error('Error converting to base64', error);
    //   });
    // } 
  }

  convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  }
  onHomeClick() {
    this.router.navigate(['/home-vms'])
  }

  Host: any[] = [];
  selectedHost: string = '';
  contactHost = ''
  async loadHost() {
    this.clientMainService.getApi({}, '/industrial/get/family').subscribe((value: any) => {
      this.Host = value.result.result.map((item: any) => ({ id: item.id, name: item.host_name }));
      if (this.record.industrial_host_id) {
        this.contactHost = ''
        setTimeout(() => {
          this.contactHost = this.record.industrial_host_id
        }, 300)
      }
      console.log(this.Host)
    })
  }

  onHostChange(event: any) {
    this.selectedHost = event[0]
  }

  handleRefresh(event: any) {
    if (this.project_config.is_industrial) {
      this.loadHost()
    } else {
      this.loadBlock()
    }
    setTimeout(() => {
      event.target.complete()
    }, 1000)
  }

}
