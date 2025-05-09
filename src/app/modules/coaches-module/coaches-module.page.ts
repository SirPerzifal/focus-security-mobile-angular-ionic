import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';
import { ToastController } from '@ionic/angular';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';

interface Schedule {
  id: number;
  block_name: string;
  unit_name: string;
  block_id: string;
  unit_id: string;
  schedule_date: string;
}
@Component({
  selector: 'app-coaches-module',
  templateUrl: './coaches-module.page.html',
  styleUrls: ['./coaches-module.page.scss'],
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

export class CoachesModulePage implements OnInit {

  constructor(private router: Router, private blockUnitService: BlockUnitService, private clientMainService: ClientMainService, private toastController: ToastController) { }

  ngOnInit() {
    this.loadCoaches('today')
    this.loadBlock()
  }

  coachSchedules: Schedule[] = [];
  daySchedules: Schedule[] = [];
  historySchedules: Schedule[] = []
  filteredHistorySchedules: Schedule[] = []

  async presentToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color
    });

    toast.present().then(() => {
    });
  }

  loadCoaches(type: string = 'today') {
    let url = ''
    if (type == 'today') {
      url = 'vms/get/coaches'
    } else {
      url = 'vms/get/coaches'
    }
    this.clientMainService.getApi([], url ).subscribe({
      next: (results) => {
        if (results.result.response_code === 200) {
          console.log(results.result.response_result)
          if (type === 'today') { 
            this.daySchedules = results.result.response_result
          } else {
            this.historySchedules = results.result.response_result
            this.filteredHistorySchedules = this.historySchedules
          }   
        } else {
        }

        // this.isLoading = false;
      },
      error: (error) => {
        this.presentToast('An error occurred while loading overnight parking data!', 'danger');
        console.error(error);
        // this.isLoading = false;
      }
    });
  }
  
  
  showDay = true;
  showHistory = false;
  showDayTrans = false;
  showHistoryTrans = false;
  choosenBlock = ''

  toggleSlide(type: string) {
    if (!this.showHistoryTrans && !this.showDayTrans) {
      this.showDay = false;
      this.showHistory = false;
      this.showDayTrans = false;
      this.showHistoryTrans = false;
      if (type == 'day') {
        this.showDayTrans = true
        if (this.daySchedules.length == 0) {
          this.loadCoaches('today')
        }
        setTimeout(() => {
          this.showDay = true;
          this.showDayTrans = false
        }, 300)
      }
      if (type == 'history') {
        this.showHistoryTrans = true
        if (this.daySchedules.length == 0) {
          this.loadCoaches('history')
        }
        setTimeout(() => {
          this.showHistory = true;
          this.showHistoryTrans = false
        }, 300)
      }
    }
  }

  startDateFilter = ''
  endDateFilter = ''

  applyFilters() {
    this.historySchedules = this.coachSchedules.filter(item => {
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

  Block: any[] = [];

  loadBlock() {
    console.log('hey this is block')
    this.blockUnitService.getBlock().subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Block = response.result.result;
          console.log(response)
        } else {
          // this.presentToast('An error occurred while loading block data!', 'danger');
        }
      },
      error: (error) => {
        // this.presentToast('An error occurred while loading block data!', 'danger');
        console.error('Error:', error);
      }
    });
    console.log(this.Block)
  }

  onBlockChange(event: any) {
    this.choosenBlock = event.target.value;
    this.applyFilters()
  }

  onChangeDate(event: any) {
    console.log(event.target.value)
    this.startDateFilter = event.target.value
    this.applyFilters()
  }

  form() {
    this.router.navigate(['coaches-form']);
  }

}
