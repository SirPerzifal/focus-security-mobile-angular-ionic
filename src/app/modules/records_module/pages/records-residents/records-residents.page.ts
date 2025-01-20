import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';

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
    private route: ActivatedRoute
  ) { }

  initTemp() {
    this.logsData = [
      {
        resident_name: 'RIVERTREE RESIDENT',
        contact: '+65 7872 123',
        resident_type: 'PRIMARY',
        is_tenant: false,
        tenant_date: '',
        block_id: '1',
        block_name: 'Block 1',
        unit_id: '2',
        unit_name: 'Unit 2',
      },
      {
        resident_name: 'AZALEA RESIDENT',
        contact: '+65 7582 553',
        resident_type: 'PRIMARY',
        is_tenant: false,
        tenant_date: '',
        block_id: '1',
        block_name: 'Block 1',
        unit_id: '1',
        unit_name: 'Unit 1',
      },
      {
        resident_name: 'COUNTSIDE RESIDENT',
        contact: '+65 6791 521',
        resident_type: 'TENANT',
        is_tenant: true,
        tenant_date: '20/12/2024',
        block_id: '1',
        block_name: 'Block 1',
        unit_id: '1',
        unit_name: 'Unit 1',
      },
    ]
    this.historyVehicles = this.logsData
  }

  ngOnInit() {
    this.initTemp()
    this.loadBlock()
  }

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
    this.filter.unit = event.target.value;
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
          this.presentToast('Failed to load block data', 'danger');
        }
      },
      error: (error) => {
        this.presentToast('Error loading block data', 'danger');
        console.error('Error:', error);
      }
    });
  }

  loadUnit() {
    this.blockUnitService.getUnit(this.filter.block).subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Unit = response.result.result; // Simpan data unit
        } else {
          this.presentToast('Failed to load unit data', 'danger');
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
      const unitMatches = this.filter.unit ? item.unit_nametoLowerCase().includes(this.filter.unit.toLowerCase()) : true;
  
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

  clearFilter() {
    this.filter.block = ''
    this.filter.unit = ''
    this.applyFilters()
  }

}
