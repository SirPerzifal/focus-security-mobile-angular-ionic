import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';
import { MainVmsService } from 'src/app/service/vms/main_vms/main-vms.service';

@Component({
  selector: 'app-records-blacklist-form',
  templateUrl: './records-blacklist-form.page.html',
  styleUrls: ['./records-blacklist-form.page.scss'],
})
export class RecordsBlacklistFormPage implements OnInit {

  constructor(
    private blockUnitService: BlockUnitService,
    private router: Router, private mainVmsService: MainVmsService,
    public functionMain: FunctionMainService) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { record: any[], is_ban_record: boolean, type: string, is_ban_notice: boolean };
    console.log(state)
    if (state) {
      this.unitShow = false
      this.record = state.record
      console.log(this.record)
      this.choosenBlock = this.record.block_id
      this.visitor_type = state.type
      this.is_ban_visitor = state.is_ban_record
      this.is_ban_notice = state.is_ban_notice
      this.is_readonly = true
      this.loadUnit().then(() => {
        console.log("TEEESSS")
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
    }
  }

  record: any
  is_ban_visitor = false
  is_ban_notice = false
  is_readonly = false
  visitor_type = 'visitor'
  unitShow = true

  ngOnInit() {
    this.loadBlock()
    this.loadProjectName()
  }

  async loadProjectName() {
    await this.functionMain.vmsPreferences().then((value) => {
      this.project_name = value.project_name.toUpperCase()
      this.formData.project_id = value.project_id
    })
  }
  project_name = ''

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
  }

  refreshVehicle() {
    if ((!this.is_ban_visitor && !this.is_ban_notice) || !this.record.vehicle_number ){
      let alphabet = 'ABCDEFGHIJKLEMNOPQRSTUVWXYZ';
      let front = ['SBA', 'SBS', 'SAA']
      let randomVhc = front[Math.floor(Math.random() * 3)] + ' ' + Math.floor(1000 + Math.random() * 9000) + ' ' + alphabet[Math.floor(Math.random() * alphabet.length)];
      this.formData.vehicle_no = randomVhc
      console.log("Vehicle Refresh", randomVhc)
    }
  }

  saveRecord() {
    let errMsg = ''
    if (!this.formData.visitor_name) {
      errMsg += 'Visitor name is required! \n'
    }
    // if (!this.formData.vehicle_no) {
    //   errMsg += 'Visitor vehicle number is required! \n'
    // }
    if (!this.formData.contact_no) {
      errMsg += 'Visitor contact number is required! \n'
    }
    if (!this.formData.reason) {
      errMsg += 'Reason of ban is required! \n'
    }
    if (!this.formData.block_id || !this.formData.unit_id) {
      errMsg += 'Block and unit must be selected! \n'
    }
    if (!this.formData.ban_image) {
      errMsg += 'Ban image is required! \n'
    }
    if (!this.formData.banned_by) {
      errMsg += 'Issue officer is required! \n'
    }
    if (errMsg != ''){
      this.functionMain.presentToast(errMsg, 'danger')
    } else {
      console.log("SAVE")
      let tempDate = new Date().toISOString().split('T')
      this.formData.last_entry_date_time = tempDate[0] + ' ' + tempDate[1].split('.')[0]
      console.log(this.formData)
      this.mainVmsService.getApi(this.formData, '/resident/post/ban_visitor').subscribe({
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

  getContactInfo(contactData: any) {
    if (!this.is_ban_visitor && !this.is_ban_notice) {
      if (contactData) {
        this.formData.visitor_name = contactData.visitor_name
        this.formData.vehicle_no = contactData.vehicle_number
        this.formData.block_id = contactData.block_id
        this.loadUnit().then(() => {
          this.formData.unit_id = contactData.unit_id
        })
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

  onBanImage(file: File): void {
    let data = file;
    if (data){
      this.convertToBase64(data).then((base64: string) => {
        console.log('Base64 successed');
        this.formData.ban_image = base64.split(',')[1]
      }).catch(error => {
        console.error('Error converting to base64', error);
      });
    } 
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

}
