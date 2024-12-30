import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
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
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loadRecordsWheelClamp()
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    // Bersihkan subscription untuk menghindari memory leaks
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
      this.blacklistData = this.existData.filter(item => item.type == 'visitor')
    }
    if (type == 'vehicle') {
      this.pageType = 'vehicle'
      this.showVehicle = true;
      this.blacklistData = this.existData.filter(item => item.type == 'vehicle')
    }
    console.log(type, this.showVehicle, this.showVisitor)
  }

  vehicleData: any[] = [];
  activeVehicles: any[] = [];
  historyVehicles: any[] = [];
  sortVehicle: any[] = []
  existData: any[] = [
    {
      visitor_name: 'Jhonson',
      vehicle_number: '',
      type: 'visitor',
      date_time: '2024-12-25'
    },
    {
      visitor_name: 'Thompson',
      vehicle_number: '',
      type: 'visitor',
      date_time: '2024-12-24'
    },
    {
      visitor_name: 'Jhonson',
      vehicle_number: 'SBS 7820 X',
      type: 'vehicle',
      date_time: '2024-12-25'
    },
   {
      visitor_name: 'Jhonson',
      vehicle_number: 'SBS 7820 X',
      type: 'vehicle',
      date_time: '2024-12-24'
    },
   {
      visitor_name: 'Jhonson',
      vehicle_number: 'SBS 9020 X',
      type: 'vehicle',
      date_time: '2024-12-25'
    },
   {
      visitor_name: 'Jhonson',
      vehicle_number: 'SBS 1111 X',
      type: 'vehicle',
      date_time: '2024-12-24'
    },
  ]
  blacklistData: any[] = this.existData.filter(item => item.type == 'visitor')
  selectedRadio: string | null = null
  searchOption: string | null = null

  onRadioClick(value: string): void {
    if (this.selectedRadio === value) {
      this.selectedRadio = null;
    } else {
      this.selectedRadio = value;
    }
    console.log(this.selectedRadio)
    if (this.selectedRadio == 'sort_date') {
      this.sortVehicle = Array.from(
        new Set(this.vehicleData.map((record) => new Date(record.issue_date).toISOString()))
      ).map((date) => ({
        vehicle_number: '',
        date: new Date(date),
        issue_date: this.convertToDDMMYYYY(new Date(date).toLocaleDateString('en-CA').split('T')[0]),
        data: this.vehicleData.filter(item => new Date(item.issue_date).setHours(0, 0, 0, 0) == new Date(date).setHours(0, 0, 0, 0)),
      })).sort((a, b) => b.date.getTime() - a.date.getTime());;
      console.log(this.sortVehicle)
    }
    if (this.selectedRadio == 'sort_vehicle') {
      this.sortVehicle = Array.from(
        new Set(this.vehicleData.map((record) => record.vehicle_number))
      ).map((vehicle_number) => ({
        vehicle_number: vehicle_number,
        date: new Date(),
        issue_date: '',
        data: this.vehicleData.filter(item => item.vehicle_number == vehicle_number),
      }));;
      console.log(this.sortVehicle)
    }
  }

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

  applyFilters() {
    this.blacklistData = this.existData.filter(item => {
      const typeMatches = this.pageType ? item.type == this.pageType : false;
      const dateMatches = this.filter.issue_date ? item.date_time == this.filter.issue_date : true;
      const vehicleNumberMatches = this.pageType == 'vehicle' ? ( this.filter.vehicle_number ? item.vehicle_number == this.filter.vehicle_number : true ) : ( this.filter.name ? item.visitor_name == this.filter.name : true );

      return typeMatches && dateMatches && ( vehicleNumberMatches);
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

  onClickNew() {
    this.router.navigate(['records-wheel-clamped-new']);
  }

  loadRecordsWheelClamp() {

    // this.offensesService.getOfffenses(this.pageType).subscribe({
    //   next: (results) => {
    //     if (results.result.response_code === 200) {
    //       this.vehicleData = results.result.response_result;
    //       console.log(this.vehicleData)
    //       this.activeVehicles = this.vehicleData.filter(item => new Date(item.issue_date).setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0))
    //       this.historyVehicles = this.vehicleData
    //     } else {
    //       this.presentToast('An error occurred while loading wheel clamp data!', 'danger');
    //     }

    //   },
    //   error: (error) => {
    //     this.presentToast('An error occurred while loading wheel clamp data!', 'danger');
    //     console.error(error);
    //   }
    // });
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
