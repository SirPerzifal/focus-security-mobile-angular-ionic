import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-records-wheel-clamped-new',
  templateUrl: './records-wheel-clamped-new.page.html',
  styleUrls: ['./records-wheel-clamped-new.page.scss'],
})
export class RecordsWheelClampedNewPage implements OnInit {

  constructor(private router: Router, private modalController: ModalController) { }

  ngOnInit() {
  }

  selectedNotice = ''
  beforeClampImageFile = null as File | null;
  afterClampImageFile = null as File | null;
  imageBeforeClampInput: string = '';
  imageAfterClampInput: string = '';
  issueOfficer = ''

  onBeforeClampImageFileSelected(file: File) {
    // Convert File to a usable format if needed
    this.beforeClampImageFile = file
    this.imageBeforeClampInput = file.name; // Or file.path if you need the full path
    console.log(this.imageBeforeClampInput);
    console.log('imageBeforeClampInputimageBeforeClampInputimageBeforeClampInputimageBeforeClampInput');


    // If you need to handle the file further
    // For example, prepare for upload
    const formData = new FormData();
    formData.append('image', file);

    // You can now use this formData for upload or further processing
  }

  onAfterClampImageFileSelected(file: File) {
    // Convert File to a usable format if needed
    this.afterClampImageFile = file
    this.imageAfterClampInput = file.name; // Or file.path if you need the full path
    console.log(this.imageAfterClampInput);
    console.log('this.imageAfterClampInputthis.imageAfterClampInputthis.imageAfterClampInputthis.imageAfterClampInput');

    // If you need to handle the file further
    // For example, prepare for upload
    const formData = new FormData();
    formData.append('image', file);

    // You can now use this formData for upload or further processing
  }

  onSubmit() {
    let errMsg = ''
    if (!this.afterClampImageFile) {
      errMsg += '1'
    } 
    if (!this.beforeClampImageFile) {
      errMsg += '2'
    } 
    if (!this.selectedNotice) {
      errMsg += '3'
    }
    if (!this.issueOfficer) {
      errMsg += '4'
    }
    if (errMsg) {
      console.log("DATA MUST FULL")
    } else {
      console.log(this.afterClampImageFile, this.imageAfterClampInput, this.beforeClampImageFile, this.imageBeforeClampInput, this.selectedNotice, this.issueOfficer);
      this.modalController.dismiss({
        result: true, data: {
          image_after: {
            file: this.afterClampImageFile,
            name: this.imageAfterClampInput
          },
          image_before: {
            file: this.beforeClampImageFile,
            name: this.imageBeforeClampInput
          },
          notice: this.selectedNotice,
          officer: this.issueOfficer
        }
      });
    }
  }

  onCancel() {
    this.modalController.dismiss(false);
  }
  
}
