import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
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
    private clientMain: ClientMainService
  ) { }

  isLoading = false
  initTemp() {
    this.isLoading = true
    let params = {
      page: this.currentPage, 
      limit: this.functionMain.limitHistory,
      block: this.filter.block,
      unit: this.filter.unit,
      name: this.filter.name,
    }
    console.log(this.filter)
    this.logsData = []
    this.clientMain.getApi(params, '/vms/get/all_record_resident').subscribe({
      next: (results) => {
      this.isLoading = false
      console.log(results)
      if (results.result.status) {
        this.logsData = results.result.data
        this.pagination = results.result.pagination
        this.total_pages = this.pagination.total_pages
      } else {
        this.currentPage = 1
        this.inputPage = 1
        this.total_pages = 0
        this.pagination = {}
      }
    },
    error: (error) => {
      this.currentPage = 1
      this.inputPage = 1
      this.total_pages = 0
      this.isLoading = false
      this.pagination = {}
      this.functionMain.presentToast(`An error occurred while loading ${this.project_config.is_industrial ? 'employee' : 'resident'} data!`, 'danger');
      console.error(error);
    }})
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

  onNameFilterChange(event: any) {
    this.filter.name = event.target.value
    this.applyFilters()
  }

  Block: any[] = []
  Unit: any[] = []

  filter = {
    block: '',
    unit: '',
    name: '',
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
    // this.historyVehicles = this.logsData.filter(item => {  
    //   const blockMatches = this.filter.block ? item.block_id == this.filter.block : true;
    //   const unitMatches = this.filter.unit ? item.unit_id == this.filter.unit : true;
  
    //   return blockMatches && unitMatches;
    // });
    // console.log(this.historyVehicles)
    this.currentPage = 1
    this.inputPage = 1
    this.initTemp()
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

  clearFilters() {
    this.Unit = []
    this.filter.block = ''
    this.filter.unit = ''
    this.filter.name = ''
    this.applyFilters()
  }

  currentPage = 1
  inputPage = 1
  total_pages = 0
  pagination: any = {}

  changePage(page: number) {
    let tempPage = page
    console.log(tempPage, this.total_pages)
    if (tempPage > 0 && tempPage <= this.total_pages) {
      this.currentPage = tempPage
      this.initTemp()
    } else {
    }
    this.inputPage = this.currentPage
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
