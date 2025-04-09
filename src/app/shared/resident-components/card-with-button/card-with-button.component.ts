import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { VisitorService } from 'src/app/service/resident/visitor/visitor.service';

@Component({
  selector: 'app-card-with-button',
  templateUrl: './card-with-button.component.html',
  styleUrls: ['./card-with-button.component.scss'],
})
export class CardWithButtonComponent  implements OnInit {

  constructor(private alertController: AlertController, private router: Router, private visitorService: VisitorService) { }

  unitId: number = 1;
  blockId: number = 1;

  @Input() historyData!: {
    purpose: string;
    visitor_name: string;
    visitor_date: string; // Ubah tipe menjadi string
    visitor_entry_time: number;
    visitor_exit_time: number;
    mode_of_entry: string;
    vehicle_number: string;
    point_of_entry: string;
    mobile_number: string;
    delivery_type: string;
    vehicle_type: string;
    banned: boolean;
    id: number;
  };
  @Input() hideResinstateButton: string = '';

  ngOnInit() {
  }

  openDetails() {
    this.router.navigate(['/history-details'], {
      state: {
        historyData: this.historyData
      }
    });
  }

  formatDate(dateString: string): string {
    const dateParts = dateString.split('-'); // Misalnya, '2023-10-15' menjadi ['2023', '10', '15']
    return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`; // Format menjadi '15/10/2023'
  }

  public async showAlertButtons(headerName: string, className: string, historyData: any) {
    const alertButtons = await this.alertController.create({
      cssClass: className,
      header: headerName + " this visitor?",
      buttons: [
        {
          text: 'Confirm',
          role: 'confirm',
          handler: () => {
            this.reinstateProcess(historyData);
            // console.log(historyData);
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Alert cancel');
          },
        },
      ]
    });
    await alertButtons.present ();
  }

  reinstateProcess(historyData: any) {
    console.log("tes");
    this.visitorService.postReinstate(
      this.blockId,
      this.unitId,
      historyData.mobile_number,
      historyData.vehicle_number
    ).subscribe(
      (response) => {
        console.log('Success:', response);
        this.router.navigate(['resident-my-profile']);
      },
    )
  }
}
