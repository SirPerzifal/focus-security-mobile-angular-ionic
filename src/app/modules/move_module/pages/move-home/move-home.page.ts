import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MoveInOutService } from 'src/app/service/vms/move_in_out_renovators/move_in_out/move-in-out.service';
import { RenovatorsService } from 'src/app/service/vms/move_in_out_renovators/renovators/renovators.service';
import { ToastController } from '@ionic/angular';
import { forkJoin, interval, Subject } from 'rxjs';
import { switchMap, takeUntil, startWith } from 'rxjs/operators';

interface Schedule {
  id: number;
  block_name: string;
  unit_name: string;
}

@Component({
  selector: 'app-move-home',
  templateUrl: './move-home.page.html',
  styleUrls: ['./move-home.page.scss'],
})
export class MoveHomePage implements OnInit, OnDestroy {
  moveInSchedules: Schedule[] = [];
  renovationSchedules: Schedule[] = [];
  isLoading: boolean = true;

  // Subject untuk mengelola subscription
  private refreshInterval: any;

  constructor(
    private router: Router,
    private moveInOutService: MoveInOutService,
    private renovatorsService: RenovatorsService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    // Load data pertama kali
    this.loadSchedules();

    // // Set interval untuk refresh setiap 5 detik
    // this.refreshInterval = setInterval(() => {
    //   this.loadSchedules();
    // }, 5000); // 5000 ms = 5 detik
  }

  // Penting: hapus interval saat komponen di destroy
  ngOnDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  loadSchedules() {
    this.isLoading = true;
    
    // Gunakan forkJoin untuk mengambil kedua jenis jadwal secara bersamaan
    forkJoin({
      moveIn: this.moveInOutService.getMoveInOutSchedules(),
      renovation: this.renovatorsService.getRenovationSchedules()
    }).subscribe({
      next: (results) => {
        if (results.moveIn.result.status_code === 200) {
          this.moveInSchedules = results.moveIn.result.result;
          console.log(results)
        } else {
          this.presentToast('An error occurred while loading Move In / Out schedule!', 'warning');
        }

        if (results.renovation.result.status_code === 200) {
          this.renovationSchedules = results.renovation.result.result;
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

  form(block: string, unit: string) {
    // Navigasi ke halaman form dengan parameter
    this.router.navigate(['move-form'], { 
      queryParams: { 
        block: block, 
        unit: unit,
        schedule_type: 'move_in_out' 
      } 
    });
  }

  renov_form(block: string, unit: string) {
    // Navigasi ke halaman form renovasi dengan parameter
    this.router.navigate(['renov-form'], { 
      queryParams: { 
        block: block, 
        unit: unit,
        schedule_type: 'renovation' 
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
      
      
    });;;
  }
}
