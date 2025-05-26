import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';

@Component({
  selector: 'app-records-alert-next',
  templateUrl: './records-alert-next.page.html',
  styleUrls: ['./records-alert-next.page.scss'],
})
export class RecordsAlertNextPage implements OnInit {

  constructor(
    private blockUnitService: BlockUnitService,
    private functionMain: FunctionMainService,
    private clientMainService: ClientMainService,
    private modalController: ModalController,
    private navParams: NavParams, 
  ) { }

  ngOnInit() {
    this.alert = this.navParams.get('alert')
    this.formData = this.navParams.get('vehicle')
    console.log(this.formData)
    this.functionMain.vmsPreferences().then(value => {
      this.project_id = value.project_id
      this.project_config = value.config
      if (this.project_config.is_industrial) {
        this.loadHost()
      } else {
        this.loadBlock()
        if (this.formData.block_id) {
          this.loadUnit().then(() => {
            if (this.formData.unit_id) {
              this.formData.unit_id = this.navParams.get('vehicle').unit_id
            }
          })
        }
      }
    })


    const closeModalOnBack = () => {
      this.modalController.dismiss(false);
      window.removeEventListener('popstate', closeModalOnBack);
    };
    window.addEventListener('popstate', closeModalOnBack)
  }

  alert = false

  project_id = 0
  project_config: any = {}

  formData = {
    id: '',
    visitor_name: '',
    vehicle_number: '',
    contact_number: '',
    block_id: '',
    unit_id: '',
    host_id: '',
    reason: '',
  }

  Block: any = []
  Unit: any = []
  Host: any = []

  contactUnit = ''
  contactHost = ''

  loadBlock() {
    this.blockUnitService.getBlock().subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Block = response.result.result;
        } else {
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while loading block data!', 'danger');
        console.error('Error:', error);
      }
    });
  }

  async loadUnit() {
    this.contactUnit = ''
    this.blockUnitService.getUnit(this.formData.block_id).subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Unit = response.result.result.map((item: any) => ({id: item.id, name: item.unit_name})); 
          console.log(this.Unit)
        } else {
          console.error('Error:', response.result);
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while loading unit data', 'danger');
        console.error('Error:', error.result);
      }
    });
  }

  loadHost() {
    this.contactHost = ''
    this.clientMainService.getApi({ project_id: this.project_id }, '/industrial/get/family').subscribe((value: any) => {
      this.Host = value.result.result.map((item: any) => ({ id: item.id, name: item.host_name }));
      if (this.formData.host_id) {
        this.contactHost = this.formData.host_id
      }
    })
  }

  onBlockChange(event: any) {
    this.formData.block_id = event.target.value;
    this.loadUnit(); // Panggil method load unit
  }

  onUnitChange(event: any) {
    this.formData.unit_id = event[0];
  }

  onHostChange(event: any) {
    this.formData.host_id = event[0];
  }

  submitAlert() {
    console.log(this.alert, this.formData)
    let url = this.alert ? '/vms/post/alert_next_visit' : '/vms/post/alerted_to_offence' 
    let errMsg = ''
    if (this.alert) {
      if (!this.formData.reason) {
        errMsg += 'Reason of issuance is required! \n'
      }
    } else {
      if (!this.formData.visitor_name) {
        errMsg += 'Visitor name is required! \n'
      }
      if ((!this.formData.block_id || !this.formData.unit_id) && !this.project_config.is_industrial) {
        errMsg += 'Block and unit is required! \n'
      }
      if ((!this.formData.host_id) && this.project_config.is_industrial) {
        errMsg += 'Host is required! \n'
      }
    }
    if (errMsg) {
      this.functionMain.presentToast(errMsg, 'danger')
      return
    }
    this.clientMainService.getApi({...this.formData, project_id: this.project_id}, url).subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code === 200) {
          this.functionMain.presentToast(results.result.response_message, 'success')
          setTimeout(() => {this.modalController.dismiss(true)}, 300);
        } else if (results.result.response_code === 201) { 
          this.functionMain.presentToast(results.result.response_message, 'warning')
          setTimeout(() => {this.modalController.dismiss(true)}, 300);
        } else {
          this.functionMain.presentToast('An error occurred while trying to alert this visitor!', 'danger');
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while trying to alert this visitor!', 'danger');
        console.error(error);
      }
    });
  }

}
