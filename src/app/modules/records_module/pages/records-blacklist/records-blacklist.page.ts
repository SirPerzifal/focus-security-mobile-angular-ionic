import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { MainVmsService } from 'src/app/service/vms/main_vms/main-vms.service';
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
    private mainVmsService: MainVmsService
  ) { }

  ngOnInit() {
    this.loadBlacklistData()
  }

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

  vehicleData: any[] = [];
  activeVehicles: any[] = [];
  historyVehicles: any[] = [];
  sortVehicle: any[] = []
  existData: any[] = []
  blacklistData: any[] = []
  selectedRadio: string | null = null
  searchOption: string | null = null

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
    this.applyFilters()
  }

  Block: any[] = []
  Unit: any[] = []

  filter = {
    name: '',
    vehicle_number: '',
    issue_date: '',
    contact: '',
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
    console.log(event.target.value)
  }

  startDateFilter = ''

  clearFilters() {
    this.searchOption = ''
    this.filter.name = ''
    this.filter.vehicle_number = ''
    this.filter.contact = ''
    this.applyFilters() 
  }


  applyFilters() {
    this.blacklistData = this.existData.filter(item => {
      const typeMatches = this.pageType == 'vehicle' ? item.vehicle_no != '' : item.vehicle_no == '';
      const contactMatches = this.filter.contact ? item.contact_number.toLowerCase().includes(this.filter.contact.toLowerCase()) : true;
      const vehicleNumberMatches = this.pageType == 'vehicle' ? ( this.filter.vehicle_number ? item.vehicle_number.toLowerCase().includes(this.filter.vehicle_number.toLowerCase()) : true ) : ( this.filter.name ? item.visitor_name.toLowerCase().includes(this.filter.name.toLowerCase()) : true );

      return typeMatches && contactMatches && vehicleNumberMatches;
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

  async loadBlacklistData() {
    this.mainVmsService.getApi({}, '/vms/get/visitor_ban').subscribe({
      next: (results) => {
        if (results.result.response_code === 200) {
          this.existData = results.result.result;
          this.blacklistData = this.existData.filter(item => item.vehicle_no == '')
        } else {
          this.presentToast('An error occurred while loading blacklist data!', 'danger');
        }
      },
      error: (error) => {
        this.presentToast('An error occurred while loading blacklist data!', 'danger');
        console.error(error);
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
}
