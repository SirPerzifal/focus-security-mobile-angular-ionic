import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-upload-excel-processor',
  templateUrl: './upload-excel-processor.component.html',
  styleUrls: ['./upload-excel-processor.component.scss'],
})
export class UploadExcelProcessorComponent  implements OnInit {

  selectExcelImport: string = '';

  constructor(private inviteeExcelService: FunctionMainService, private modalController: ModalController) { }

  ngOnInit() {}

  truncateFileName(fileName: string, maxLength: number): string {
    if (fileName.length <= maxLength) {
      return fileName;
    }
    
    const extension = fileName.split('.').pop();
    const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
    const truncatedLength = maxLength - extension!.length - 4; // 4 untuk "..." dan "."
    
    return nameWithoutExt.substring(0, truncatedLength) + '...' + '.' + extension;
  }

  async onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.selectExcelImport = file ? this.truncateFileName(file.name, 30) : '';
    if (!file) return;

    const invitees = await this.inviteeExcelService.parseExcelToInvitees(file);
    this.modalController.dismiss(invitees);
  }

}
