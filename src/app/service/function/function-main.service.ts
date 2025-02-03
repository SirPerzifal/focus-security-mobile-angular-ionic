import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class FunctionMainService {

  constructor(private toastController: ToastController) { }

  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      color: color
    });
    toast.present();
  }

  convertToDDMMYYYY(dateString: string): string {
    const [year, month, day] = dateString.split('-'); // Pisahkan string berdasarkan "-"
    return `${day}/${month}/${year}`; // Gabungkan dalam format dd/mm/yyyy
  }

  returnNone(params: any) {
    return params ? params : '-'
  }
}
