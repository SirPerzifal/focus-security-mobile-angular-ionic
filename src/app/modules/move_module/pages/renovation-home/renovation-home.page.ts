import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MoveInOutService } from 'src/app/service/vms/move_in_out_renovators/move_in_out/move-in-out.service';
import { RenovatorsService } from 'src/app/service/vms/move_in_out_renovators/renovators/renovators.service';
import { ToastController } from '@ionic/angular';
import { forkJoin, interval, Subject } from 'rxjs';
import { switchMap, takeUntil, startWith } from 'rxjs/operators';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';

interface Schedule {
  id: number;
  block_name: string;
  unit_name: string;
  block_id: string;
  unit_id: string;
  schedule_date: string;
}

@Component({
  selector: 'app-renovation-home',
  templateUrl: './renovation-home.page.html',
  styleUrls: ['./renovation-home.page.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class RenovationHomePage implements OnInit {

  constructor(
    private router: Router,
    private renovatorsService: RenovatorsService,
    private toastController: ToastController,
    private blockUnitService: BlockUnitService,
  ) { }

  renovationSchedules: Schedule[] = [];
  daySchedules: Schedule[] = [];
  historySchedules: Schedule[] = []
  isLoading: boolean = true;

  // Subject untuk mengelola subscription
  private refreshInterval: any;
  ngOnInit() {
    this.loadSchedules();
    this.loadBlock()
  }

  loadSchedules() {
    console.log("TES")
    this.isLoading = false;

    // Gunakan forkJoin untuk mengambil kedua jenis jadwal secara bersamaan
    forkJoin({
      renovation: this.renovatorsService.getRenovationSchedules()
    }).subscribe({
      next: (results) => {

        if (results.renovation.result.status_code === 200) {
          this.renovationSchedules = results.renovation.result.result;
          this.daySchedules = this.renovationSchedules.filter(item => new Date(item.schedule_date) == new Date() )
          this.historySchedules = this.renovationSchedules
        } else {
          this.presentToast('An error occurred while loading Renovations schedule!', 'warning');
        }

        this.isLoading = false;
      },
      error: (error) => {
        this.presentToast('An error occurred while loading Renovations schedule!', 'danger');
        console.error(error);
        this.isLoading = false;
      }
    });
  }

  async presentToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color
    });

    toast.present().then(() => {
    });
  }
  showDay = true;
  showHistory = false;
  showDayTrans = false;
  showHistoryTrans = false;
  
  renov_form(block: string, unit: string, block_id: string = '1', unit_id: string = '1') {
    // Navigasi ke halaman form renovasi dengan parameter
    console.log(block_id, unit_id)
    this.router.navigate(['renov-form'], {
      queryParams: {
        block_id: block_id,
        unit_id: unit_id,
        block: block,
        unit: unit,
        schedule_type: 'renovation'
      }
    });
  }

  toggleSlide(type: string) {
    if (!this.showHistoryTrans && !this.showDayTrans) {
      this.showDay = false;
      this.showHistory = false;
      this.showDayTrans = false;
      this.showHistoryTrans = false;
      if (type == 'day') {
        this.showDayTrans = true
        setTimeout(() => {
          this.showDay = true;
          this.showDayTrans = false
        }, 300)
      }
      if (type == 'history') {
        this.showHistoryTrans = true
        setTimeout(() => {
          this.showHistory = true;
          this.showHistoryTrans = false
        }, 300)
      }
    }
  }

  Block: any[] = [];

  loadBlock() {
    console.log('hey this is block')
    this.blockUnitService.getBlock().subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Block = response.result.result;
          console.log(response)
        } else {
          this.presentToast('An error occurred while loading block data!', 'danger');
        }
      },
      error: (error) => {
        this.presentToast('An error occurred while loading block data!', 'danger');
        console.error('Error:', error);
      }
    });
    console.log(this.Block)
  }

  choosenBlock = ''

  onBlockChange(event: any) {
    console.log(event.target.value)
    this.choosenBlock = event.target.value;
    console.log(this.choosenBlock)
    this.applyFilters()
  }

  startDateFilter = ''
  endDateFilter = ''

  applyFilters() {
    this.historySchedules = this.renovationSchedules.filter(item => {
      const visitorDate = new Date(item.schedule_date);
      visitorDate.setHours(0, 0, 0, 0);  // Set time to 00:00:00 for date comparison
  
      // Convert the selected start and end dates to Date objects
      const selectedStartDate = this.startDateFilter ? new Date(this.startDateFilter) : null;
      const selectedEndDate = this.endDateFilter ? new Date(this.endDateFilter) : null;
  
      // Set time to 00:00:00 for comparison
      if (selectedStartDate) {
        selectedStartDate.setHours(0, 0, 0, 0);
      }
      if (selectedEndDate) {
        selectedEndDate.setHours(0, 0, 0, 0);
      }
  
      const dateMatches = (!selectedStartDate || visitorDate >= selectedStartDate) && (!selectedEndDate || visitorDate <= selectedEndDate);
      const typeMatches = this.choosenBlock ? item.block_id == this.choosenBlock : true;
  
      return typeMatches && dateMatches;
    });
    console.log(this.historySchedules)
  }
}
