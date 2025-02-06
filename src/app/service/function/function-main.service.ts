import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { MainVmsService } from '../vms/main_vms/main-vms.service';

@Injectable({
  providedIn: 'root'
})
export class FunctionMainService {

  constructor(private toastController: ToastController, private mainVmsService: MainVmsService) { }

  async presentToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
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

  convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  }

  nricChange(nric: string){
    if (nric.length > 1) {
      nric = nric
        .split('')
        .map((char, index) => (index >= 1 && index <= 5 ? 'X' : char))
        .join('');
    }
    return nric
  }

  async getProjectConfig() {
    this.mainVmsService.getApi({}, '/vms/get/project_configuration').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.status_code === 200) {
          return(results.result.result[0].is_guarded)
        } else {
          this.presentToast(`Failed to ge project configuration`, 'danger');
          return false
        }
        

      },
      error: (error) => {
        this.presentToast('An error occurred while processing function!', 'danger');
        console.error(error);
        return false
      }
    });
  }
}
