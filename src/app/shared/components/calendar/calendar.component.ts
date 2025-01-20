import { Component, Input } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {
  @Input() viewDate!: Date; // Tanggal yang akan ditampilkan
  @Input() events!: CalendarEvent[]; // Daftar acara untuk hari tersebut

  constructor(private modalController: ModalController) {}

  dismiss() {
    this.modalController.dismiss();
  }
}