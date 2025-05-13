import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { OffensesService } from 'src/app/service/vms/offenses/offenses.service';

@Component({
  selector: 'app-records-blacklist',
  templateUrl: './records-blacklist.page.html',
  styleUrls: ['./records-blacklist.page.scss'],
})
export class RecordsBlacklistPage implements OnInit {

  constructor(
    private toastController: ToastController,
    private router: Router,
    private offensesService: OffensesService,
    private modalController: ModalController,
    private route: ActivatedRoute,
    private clientMainService: ClientMainService,
    public functionMain: FunctionMainService,
    private blockUnitService: BlockUnitService
  ) { }

  ngOnInit() {
    this.loadProjectName().then(() => {
      this.loadBlacklistData()
      if (this.project_config.is_industrial) {
        this.loadHost()
      } else {
        this.loadBlock()
      }
    })
    this.route.queryParams.subscribe(params => {
      if (params ) {
        if (params['reload']){
          this.loadProjectName().then(() => {
            this.loadBlacklistData()
          })
        }
      }
    })
  }

  async loadProjectName() {
    await this.functionMain.vmsPreferences().then((value) => {
      this.project_id = value.project_id
      this.project_config = value.config
    })
  }

  project_config: any = []
  project_id = 0

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }


  params: any
  pageType = 'visitor'
  showVisitor = true;
  showVehicle = false;

  toggleSlide(type: string) {
    this.showVisitor = false;
    this.showVehicle = false;
    if (type != this.pageType) {
      this.searchOption = ''
      this.filter = {
        vehicle_number: '',
        name: '',
        contact: '',
        issue_date: '',
        block: '',
        unit: '',
      }
    }
    if (type == 'visitor') {
      this.pageType = 'visitor'
      this.showVisitor = true;
      this.blacklistData = this.existData.filter(item => item.vehicle_no == '')
    }
    if (type == 'vehicle') {
      this.pageType = 'vehicle'
      this.showVehicle = true;
      this.blacklistData = this.existData.filter(item => item.vehicle_no != '')
    }
    console.log(type, this.showVehicle, this.showVisitor)
    console.log(this.blacklistData)
  }

  activeVehicles: any[] = [];
  historyVehicles: any[] = [];
  existData: any[] = []
  blacklistData: any[] = []
  searchOption: string = ''

  convertToDDMMYYYY(dateString: string): string {
    const [year, month, day] = dateString.split('-'); // Pisahkan string berdasarkan "-"
    return `${day}/${month}/${year}`; // Gabungkan dalam format dd/mm/yyyy
  }

  onDateChange(event: any) {
    console.log(event.target.value)
    this.filter.issue_date = event.target.value;
    this.applyFilters()
  }

  onVehicleFilterChange(event: any) {
    this.filter.vehicle_number = event.target.value
    this.applyFilters()
  }

  onNameFilterChange(event: any) {
    this.filter.name = event.target.value
    this.applyFilters()
  }

  onContactFilterChange(event: any) {
    this.filter.contact = event.target.value
    console.log(this.filter.contact)
    this.applyFilters()
  }

  onBlockChange(event: any) {
    this.filter.block = event.target.value;
    this.filter.unit = ''
    this.loadUnit(); // Panggil method load unit
    this.applyFilters()
  }

  onUnitChange(event: any) {
    this.filter.unit = event[0];
    this.applyFilters()
  }
  contactUnit = ''

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
    this.filter.unit
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

  Block: any[] = []
  Unit: any[] = []

  filter = {
    name: '',
    vehicle_number: '',
    issue_date: '',
    contact: '',
    block: '',
    unit: ''
  }


  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      color: color
    });
    toast.present();
  }

  onSearchOptionChange(event: any) {
    this.searchOption = event.target.value
    this.filter.name = ''
    this.filter.vehicle_number = ''
    this.filter.contact = ''
    this.contactUnit = ''
    this.filter.block = ''
    this.filter.unit = ''
    this.contactHost = ''
    this.selectedHost = ''
    this.applyFilters()
    console.log(event.target.value)
  }

  startDateFilter = ''

  clearFilters() {
    this.searchOption = ''
    this.filter.name = ''
    this.filter.vehicle_number = ''
    this.filter.contact = ''
    this.contactUnit = ''
    this.filter.block = ''
    this.filter.unit = ''
    this.contactHost = ''
    this.selectedHost = ''
    this.applyFilters() 
  }


  applyFilters() {
    this.blacklistData = this.existData.filter(item => {
      const typeMatches = this.pageType == 'vehicle' ? item.vehicle_no != '' : item.vehicle_no == '';
      const contactMatches = this.filter.contact ? item.contact_no.includes(this.filter.contact) : true;
      const vehicleNumberMatches = this.pageType == 'vehicle' ? ( this.filter.vehicle_number ? item.vehicle_no.toLowerCase().includes(this.filter.vehicle_number.toLowerCase()) : true ) : ( this.filter.name ? item.visitor_name.toLowerCase().includes(this.filter.name.toLowerCase()) : true );

      const blockMatches = this.filter.block ? item.block_id[0] == this.filter.block : true;
      const unitMatches =  this.filter.unit ? item.unit_id[0] == this.filter.unit : true;
      const hostMatches =  this.selectedHost ? item.industrial_host_ids.includes(parseInt(this.selectedHost)) : true;

      return hostMatches && blockMatches && unitMatches && typeMatches && contactMatches && vehicleNumberMatches;
    });
    console.log(this.blacklistData)
  }

  onArrowClick(vehicle: any[]) {
    this.router.navigate(['records-wheel-clamped-detail'], {
      state: {
        vehicle: vehicle,
      },
      queryParams: this.params
    });
  }

  isLoading = false
  async loadBlacklistData() {
    this.isLoading = true
    this.clientMainService.getApi({project_id: this.project_id}, '/vms/get/visitor_ban').subscribe({
      next: (results) => {
        console.log(results);
        if (results.result.response_code === 200) {
          this.existData = results.result.result;
          this.applyFilters()
          if (this.pageType == 'visitor') {
            this.blacklistData = this.existData.filter(item => item.vehicle_no == '')
          } else {
            this.blacklistData = this.existData.filter(item => item.vehicle_no != '')
          }
        } else {
          this.existData = []
        }
        this.isLoading = false
      },
      error: (error) => {
        this.presentToast('An error occurred while loading blacklist data!', 'danger');
        console.error(error);
        this.isLoading = false
      }
    });
  }

  onNewData() {
    this.router.navigate(['/records-blacklist-form'])
  }

  onClickDetail(record: any) {
    this.router.navigate(['/records-blacklist-detail'], {
      state: {
        record: record
      }
    })
  }

  Host: any[] = [];
  selectedHost: string = '';
  contactHost = ''
  loadHost() {
    this.clientMainService.getApi({ project_id: this.project_id }, '/industrial/get/family').subscribe((value: any) => {
      this.Host = value.result.result.map((item: any) => ({ id: item.id, name: item.host_name }));
    })
  }

  onHostChange(event: any) {
    this.selectedHost = event[0]
    this.applyFilters()
  }
}
