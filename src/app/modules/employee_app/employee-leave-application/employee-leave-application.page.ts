import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    event.target.complete()
  }

}
