import { Injectable } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { MainVmsService } from '../vms/main_vms/main-vms.service';
import { ContractorNricScanPage } from 'src/app/modules/contractor_module/pages/contractor-nric-scan/contractor-nric-scan.page';
import { Preferences } from '@capacitor/preferences';
import { AuthService } from '../resident/authenticate/authenticate.service';
import { Capacitor } from '@capacitor/core';
import { FileOpener } from '@capacitor-community/file-opener';
import { Filesystem, Directory } from '@capacitor/filesystem';

@Injectable({
  providedIn: 'root'
})
export class FunctionMainService {

  constructor(
    private toastController: ToastController,
    private mainVmsService: MainVmsService,
    private modalController: ModalController,
    private authService: AuthService
  ) { }

  async presentToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      color: color
    });
    toast.present();
  }

  convertToDDMMYYYY(dateString: string | undefined): string | undefined {
    // Memisahkan string berdasarkan "-"
    const parts = dateString?.split('-');
    
    // Memastikan bahwa kita memiliki 3 bagian (tahun, bulan, hari)
    if (parts?.length === 3) {
      const [year, month, day] = parts; // Pisahkan menjadi tahun, bulan, dan hari
      return `${day}/${month}/${year}`; // Gabungkan dalam format dd/mm/yyyy
    } else {
      return dateString; // Kembalikan string asli jika format tidak sesuai
    }
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

  nricChange(nric: string) {
    console.log(nric)
    if (nric.length > 9) {
      nric = nric.substring(0, 9)
    }
    if (nric.length > 1) {
      nric = nric
        .split('')
        .map((char, index) => (index >= 1 && index <= 5 ? 'X' : char))
        .join('');
    }
    return nric
  }

  async getProjectConfig(project_id: number) {
    try {
      const results = await this.mainVmsService.getApi({project_id: project_id}, '/vms/get/project_configuration').toPromise();
      console.log(results);

      if (results.result.status_code === 200) {
        return results.result.result[0];
      } else {
        this.presentToast('Failed to get project configuration', 'danger');
        return false;
      }
    } catch (error) {
      this.presentToast('An error occurred while processing function!', 'danger');
      console.error(error);
      return false;
    }
  }

  async presentModalNric(): Promise<any> {
    const modal = await this.modalController.create({
      component: ContractorNricScanPage,
      cssClass: 'nric-scan-modal',

    });
    await modal.present();

    // // Tambahkan state ke history agar tombol Back menutup modal dulu
    history.pushState({ modalOpen: true }, '');

    // // Event listener untuk tombol Back
    const closeModalOnBack = () => {
        modal.dismiss();
        window.removeEventListener('popstate', closeModalOnBack);
    };

    window.addEventListener('popstate', closeModalOnBack);


    // let backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, () => {
    //   modal.dismiss();
    // });

    const result = await modal.onDidDismiss();

    // window.removeEventListener('popstate', closeModalOnBack);

    // // Bersihkan listener setelah modal ditutup
    // backButtonSubscription.unsubscribe();
    console.log(result)
    if (result.data) {
      console.log(result.data)
      let min_digit = result.data.min_digit ? result.data.min_digit : 8
      let max_digit = result.data.max_digit ? result.data.max_digit : 9
      let nric = result.data.data;
      let nric_clear = nric.replace(/([A-Za-z]\d+)([A-Za-z])\d+/, '$1$2');
      console.log(nric, nric_clear, nric_clear.length)
      console.log(min_digit, max_digit)
      if (nric_clear.length > max_digit) {
        this.presentToast(`NRIC / FIN cannot be more than ${max_digit} digits.`, 'danger');
        return ''
      }
      if (nric_clear.length < min_digit) {
        this.presentToast(`NRIC / FIN must be at least ${min_digit} digits.`, 'danger');
        return ''
      }
      return {
        data: nric_clear.split('').map((char: any, index: number) => (index >= 1 && index <= nric_clear.length - 5 ? 'X' : char)).join(''),
        is_fin: /\d$/.test(nric)
      }
    }

    return ''
  }

  uppercaseFirst(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1)
  }

  uppercaseFirstWithUnderscore(text: string) {
    return text
      .replace('_', ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  convertDateExtend(dateString: string): string {
    let dateFront = dateString.split(' ')[0]
    const [year, month, day] = dateFront.split('-'); // Pisahkan string berdasarkan "-"
    return `${day}/${month}/${year} ` + dateString.split(' ')[1]; // Gabungkan dalam format dd/mm/yyyy
  }

  isValidBase64(str: string): boolean {
    if (!str || typeof str !== 'string') return false;
  
    const base64Regex = /^(?:[A-Za-z0-9+/]{4})*?(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
    return base64Regex.test(str.trim());
  }

  getImage(image: string) {
    if (this.isValidBase64(image)) {
      return `data:image/png;base64,${image}`
    } else {
      return `assets/icon/exc-client/no_image.jpg`
    }
  }

  getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.2)`;  // Warna transparan untuk background
  }

  countryCodes = [
    {
      country: 'SG',
      code: '65',
      digit: 8,
    },
    {
      country: 'ID',
      code: '62',
      digit: 12,
    },
    {
      country: 'MY',
      code: '60',
      digit: 9,
    },
  ]

  checkPhoneDigit(phone: any) {

  }

  timeToInt(time: string) {
    return (parseInt(time.split(':')[0]) * 60) + parseInt(time.split(':')[1])
  }

  convertNewDateTZ(date_string: string) {
    let tz = new Date().getTimezoneOffset() / -60
    let dateObj = new Date(date_string);

    // Adjust the datetime by adding the timezone offset in hours
    dateObj.setHours(dateObj.getHours() + tz);

    return dateObj.toLocaleString('en-GB', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false
    }).replace(',', '');
  }

  vmsPreferences(): Promise<any> {
    return Preferences.get({ key: 'USER_INFO' }).then((result) => {
      if (result.value) {
        let preference_data = this.authService.parseJWTParamsVMS(result.value);
        return preference_data;
      } else {
        return false;
      }
    });
  }

  async downloadDocument(base64Doc: string, title: string) {
    try {
      const byteCharacters = atob(base64Doc);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      if (Capacitor.isNativePlatform()) {
        const base64 = await this.convertBlobToBase64(blob);
        const saveFile = await Filesystem.writeFile({
          path: `${title}.pdf`,
          data: base64,
          directory: Directory.Data
        });
        const path = saveFile.uri;
        await FileOpener.open({
          filePath: path,
          contentType: blob.type
        });
        console.log('File is opened');
      } else {
        const href = window.URL.createObjectURL(blob);
        this.downloadFile(href, `${title}.pdf`);
      }
    } catch (error) {
      console.error('Error downloading document:', error);
      // Optionally, show an error message to the user
    }
  }

  convertBlobToBase64(blob: Blob) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(blob);
    });
  }

  downloadFile(href: string, filename: string) {
    const link = document.createElement("a");
    link.style.display = "none";
    link.href = href;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
        URL.revokeObjectURL(link.href);
        // Periksa apakah parentNode tidak null sebelum menghapus
        if (link.parentNode) {
            link.parentNode.removeChild(link);
        }
    }, 0);
  }

  formatDateFacility(dateString: string): string {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      });
    } catch {
      return dateString;
    }
  }

  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; // Format as dd/mm/yyyy
  }


  convertBase64ToBlob(base64: string) {
    const byteCharacters = atob(base64);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      byteArrays.push(new Uint8Array(byteNumbers));
    }
    const blob = new Blob(byteArrays, { type: 'application/pdf' });
    return URL.createObjectURL(blob);
  }

  async getLprConfig(project_id: number) {
    try {
      const results = await this.mainVmsService.getApi({project_id: project_id}, '/fs/get/latest_vehicle_number').toPromise();
      console.log(results);

      if (results.result.response_code === 200) {
        if (results.result.response_result[0].vehicle_number) {
        }
        return results.result.response_result[0];
      } else {
        this.presentToast('Failed to get project latest vehicle number', 'danger');
        return false;
      }
    } catch (error) {
      this.presentToast('An error occurred while loading latest vehicle number!', 'danger');
      console.error(error);
      return false;
    }
  }


}
