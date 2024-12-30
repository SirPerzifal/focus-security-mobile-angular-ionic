import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alert-paynow',
  templateUrl: './alert-paynow.page.html',
  styleUrls: ['./alert-paynow.page.scss'],
})
export class AlertPaynowPage implements OnInit {

  constructor(private router: Router) {
  const navigation = this.router.getCurrentNavigation();
  const state = navigation?.extras.state as { alert: any};
  if (state) {
    this.alertsIssues = [state.alert]
    console.log(this.alertsIssues)
    console.log("Is Array:", Array.isArray(this.alertsIssues));

    // this.exit_date = temp_schedule.setHours(temp_schedule.getHours() + 1);
  } 
  }

  total_amount = "$250.00"
  alertsIssues: any[] = [];

  ngOnInit() {
  }

  fileUpload = null as File | null;
  fileName = ''

  onFileUpload(file: File) {
    // Convert File to a usable format if needed
    this.fileUpload = file;
    this.fileName = file.name; // Or file.path if you need the full path
    
    // If you need to handle the file further
    // For example, prepare for upload
    const formData = new FormData();
    formData.append('image', file);
    console.log(formData)
    // You can now use this formData for upload or further processing
  }

}
