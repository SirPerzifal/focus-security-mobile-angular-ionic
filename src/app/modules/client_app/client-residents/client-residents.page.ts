import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { WebRtcService } from 'src/app/service/fs-web-rtc/web-rtc.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { RecordsResidentService } from 'src/app/service/vms/records/records-resident.service';

@Component({
  selector: 'app-client-residents',
  templateUrl: './client-residents.page.html',
  styleUrls: ['./client-residents.page.scss'],
})
export class ClientResidentsPage implements OnInit {

  constructor(private webRtcService: WebRtcService, public functionMain: FunctionMainService, private clientMain: ClientMainService, private recordsResidentService: RecordsResidentService, private router: Router) { }

  ngOnInit() {
    this.loadResident()
  }

  Residents: any = []
  faPhone = faPhone

  isLoading = false
  async loadResident(){
    this.isLoading = true
    let params = {
      page: this.currentPage, 
      limit: this.functionMain.limitHistory, 
      name: this.nameFilter,
    }
    this.Residents = []
    this.clientMain.getApi(params, '/vms/get/all_record_resident').subscribe({
      next: (results) => {
      this.isLoading = false
      console.log(results)
      if (results.result.status) {
        this.Residents = results.result.data
        this.pagination = results.result.pagination
      } else {
        this.pagination = {}
      }
    },
    error: (error) => {
      this.isLoading = false
      this.pagination = {}
      this.functionMain.presentToast('An error occurred while loading resident data!', 'danger');
      console.error(error);
    }})
  }

  onBack() {
    this.router.navigate(['/client-main-app'], {queryParams: {reload: true}})
    
  }

  callResident(resident: any) {
    this.webRtcService.createOffer(false, resident.family_id, false, false);
  }

  nameFilter = ''

  onNameFilterChange(event: any) {
    this.nameFilter = event.target.value
    this.applyFilter()
  }

  clearFilters() {
    this.nameFilter = ''
    this.applyFilter()
  }

  applyFilter() {
    this.currentPage = 1
    this.inputPage = 1
    this.loadResident()
  }

  handleRefresh(event: any) {
    this.loadResident().then(() => event.target.complete())
  }

  currentPage = 1
  inputPage = 1
  total_pages = 0
  pagination: any = {}

  pageForward(page: number) {
    this.currentPage = page
    this.inputPage = page
    this.loadResident()
  }

}
