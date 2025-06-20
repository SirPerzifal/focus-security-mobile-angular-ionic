import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';

@Component({
  selector: 'app-employee-leave-application',
  templateUrl: './employee-leave-application.page.html',
  styleUrls: ['./employee-leave-application.page.scss'],
})
export class EmployeeLeaveApplicationPage implements OnInit {

  constructor(
    private router: Router,
    public functionMain: FunctionMainService,
    private clientMainService: ClientMainService
  ) { }

  leaveForm = {
    full_name: '',
    application_date: new Date(),
    work_site: '',
    reason_for_leave: '',
    attachment: '',
    start_leave_date: '',
    end_leave_date: '',
    no_of_days: 0,
    signature: ''
  }

  ngOnInit() {
    this.loadLeaves()
  }

  onBack() {
    this.router.navigate(['/employee-main'])
  }

  onSubmit() {
    console.log(this.leaveForm)
  }

  onChangeStartDate(event: any) {
    this.leaveForm.start_leave_date = event.target.value
  }

  onChangeEndDate(event: any) {
    this.leaveForm.start_leave_date = event.target.value
  }

  handleRefresh(event: any) {
    this.loadLeaves()
    event.target.complete()
  }

  @ViewChild('employeeSupporting') fileInput!: ElementRef
  openFileInput() {
    this.fileInput?.nativeElement.click();
  }
  fileName = ''

  selectedFile: File | null = null;
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log(file)
      if (['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
        this.selectedFile = file;
        this.fileName = file.name
        console.log(file.name)
  
        // Konversi file ke base64
        const reader = new FileReader();
        reader.onload = (e: any) => {
          // Hapus prefix data URL jika ada
          const base64 = e.target.result.split(',')[1] || e.target.result;
          this.leaveForm.attachment = base64;
        };
        reader.readAsDataURL(file);
        
      } else {
        this.fileName = ''
        this.functionMain.presentToast("Can only receive png, jpg, and jpg files!", 'danger')
      }
      
    }
  }

  uploadFile() {
    if (this.selectedFile) {
      this.functionMain.presentToast(`File ${this.selectedFile.name} ready to upload`, 'success');
    } else {
      this.functionMain.presentToast('Choose your file first', 'danger');
    }
  }

  isLoading = false
  loadLeaves() {
    this.isLoading = true
    this.clientMainService.getApi({}, '/employee/get/reason_for_leave').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.status_code == 200) {
          
        } else {
          this.functionMain.presentToast(results.result.status_message, 'danger');
        }
        this.isLoading = false
      },
      error: (error) => {
        this.isLoading = false
        this.functionMain.presentToast('An error occurred while loading schedule data!', 'danger');
        console.error(error);
      }
    });
  }
  

}
