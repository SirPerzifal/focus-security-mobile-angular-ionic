import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';
import { RecordsResidentService } from 'src/app/service/vms/records/records-resident.service';

@Component({
  selector: 'app-records-residents',
  templateUrl: './records-residents.page.html',
  styleUrls: ['./records-residents.page.scss'],
})
export class RecordsResidentsPage implements OnInit {

  constructor(
    private blockUnitService: BlockUnitService, 
    private toastController: ToastController, 
    private router: Router, 
    private modalController: ModalController,
    private route: ActivatedRoute,
    private recordsResidentService: RecordsResidentService,
    private functionMain: FunctionMainService,
  ) { }

  isLoading = false
  initTemp() {
    this.isLoading = true
    this.logsData = [];
    this.historyVehicles = this.logsData
    this.recordsResidentService.loadAllResident(this.project_id, this.project_config.is_windows).subscribe(
      (response: any) => {
        console.log(response)
        if (response.result.status === 'success') {
          this.logsData = response.result.data;
          this.historyVehicles = this.logsData
          this.applyFilters()
        } else {
          // this.presentToast('Failed to load resident data', 'danger');
        }
        this.isLoading = false
      },
    )
  }

  ngOnInit() {
    this.loadProjectName().then(() => {
      console.log(this.project_config)
      this.initTemp()
      this.loadBlock()
    })
  }

  async loadProjectName() {
    await this.functionMain.vmsPreferences().then((value) => {
      this.project_id = value.project_id
      this.project_config = value.config
    })
  }

  project_id = 0
  project_config: any = []

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  params: any

  logsData: any[] = [];
  historyVehicles: any[] = [];
  sortVehicle: any[] = []

  convertToDDMMYYYY(dateString: string): string {
    const [year, month, day] = dateString.split('-'); 
    return `${day}/${month}/${year}`; 
  }

  onBlockChange(event: any) {
    this.filter.block = event.target.value;
    this.filter.unit = ''
    this.loadUnit(); 
    this.applyFilters()
  }

  onUnitChange(event: any) {
    this.filter.unit = event[0];
    this.applyFilters()
  }

  Block: any[] = []
  Unit: any[] = []

  filter = {
    block: '',
    unit: '',
  }

  loadBlock() {
    this.blockUnitService.getBlock().subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Block = response.result.result;
        } else {
        }
      },
      error: (error) => {
        this.presentToast('Error loading block data', 'danger');
        console.error('Error:', error);
      }
    });
  }

  async loadUnit() {
    this.filter.unit = ''
    this.blockUnitService.getUnit(this.filter.block).subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Unit = response.result.result.map((item: any) => ({id: item.id, name: item.unit_name}))
        } else {
          console.error('Error:', response.result);
        }
      },
      error: (error) => {
        this.presentToast('Error loading unit data', 'danger');
        console.error('Error:', error.result);
      }
    });
  }

  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      color: color
    });
    toast.present();
  }


  applyFilters() {
    this.historyVehicles = this.logsData.filter(item => {  
      const blockMatches = this.filter.block ? item.block_id == this.filter.block : true;
      const unitMatches = this.filter.unit ? item.unit_id == this.filter.unit : true;
  
      return blockMatches && unitMatches;
    });
    console.log(this.historyVehicles)
  }

  onArrowClick(logs: any[]){
    console.log(logs)
    this.router.navigate(['records-residents-detail'], {
      state: {
        logs: logs,
      },
      queryParams: this.params
    });
  }

  loadRecordsResidents() {
    // this.isLoading = false;

    // this.offensesService.getOfffenses(this.pageType).subscribe({
    //   next: (results) => {
    //     if (results.result.response_code === 200) {
    //       this.logsData = results.result.response_result;
    //       console.log(this.logsData)
    //       this.activeVehicles = this.logsData.filter(item => new Date(item.issue_date).setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0))
    //       this.historyVehicles = this.logsData
    //     } else {
    //       this.presentToast('An error occurred while loading wheel clamp data!', 'danger');
    //     }

    //     // this.isLoading = false;
    //   },
    //   error: (error) => {
    //     this.presentToast('An error occurred while loading wheel clamp data!', 'danger');
    //     console.error(error);
    //     // this.isLoading = false;
    //   }
    // });
  }

  clearFilters() {
    this.Unit = []
    this.filter.block = ''
    this.filter.unit = ''
    this.applyFilters()
  }

  handleRefresh(event: any) {
    if (this.project_config.is_industrial) {
    } else {
      this.loadBlock()
    }
    this.initTemp()
    setTimeout(() => {
      event.target.complete()
    }, 1000)
  }

}
