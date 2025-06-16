import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { GetUserInfoService } from 'src/app/service/global/get-user-info/get-user-info.service';

@Component({
  selector: 'app-client-polling',
  templateUrl: './client-polling.page.html',
  styleUrls: ['./client-polling.page.scss'],
})
export class ClientPollingPage implements OnInit {

  constructor(private router: Router, private clientMainService: ClientMainService, public functionMain: FunctionMainService, private getUserInfoService: GetUserInfoService) { }

  ngOnInit() {
    this.getUserInfoService.getPreferenceStorage(
      'project_id'
    ).then((value) => {
      console.log("tes", value)
      this.project_id = value.project_id != null ? value.project_id : 191;
    })
    this.loadPolling()
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  onBack() {
    if (this.isMain) {
      this.router.navigate(['/client-main-app'])
    } else {
      this.isMain = true
      this.dataForGraph = []
    }
  }

  project_id = 191

  isActive = true
  isClosed = false
  isNew = false
  textSecond = 'Active'

  toggleActive() {
    this.textSecond = 'Active'
    this.isClosed = false
    this.isActive = true
    this.isNew = false
    this.loadPolling()
  }

  toggleClosed() {
    this.textSecond = 'Closed'
    this.isClosed = true
    this.isActive = false
    this.isNew = false
    this.loadPolling()
  }

  toggleNew() {
    this.textSecond = 'New Poll'
    this.isClosed = false
    this.isActive = false
    this.isNew = true
    this.resetForm()
  }

  newPollingName = ''
  newPollingStartDate = ''
  newPollingEndDate = ''
  newPollingIsMulti = false
  newPollingOptions: any = [
    {
      name: '',
      sequence: 0,
    }
  ]

  voteNow: boolean = false;
  dataForVote: any = [];
  closeVote: any = []; // Flag for closing animation
  openVote: any = []; // Flag for opening animation
  showVotedata: any = []

  isMain = true
  viewDetail(vote: any) {
    let background_color = vote.options.map((item: any) => this.functionMain.getRandomColor())
    console.log(vote)
    let detail = {
      id: vote.id,
      title: vote.polling_name,
      time_close: vote.polling_end_date,
      states: vote.states,
      time_you_vote: '',
      you_vote: '',
      voted_count: vote.voted_count,
      not_voted_count: vote.not_voted_count,
      polling_start_date: vote.polling_start_date,
      polling_end_date: vote.polling_end_date,
      forChart: {
        labels: vote.options.map((item: any) => item.options),
        datasets: {
          data: vote.options.map((item: any) => item.vote_count), // Different vote counts
          backgroundColor: background_color,
          borderColor: background_color,
        }
      },
      optionsTemp: vote.options
    }
    console.log(detail)
    this.isMain = false
    this.dataForGraph = detail
  }



  onSubmit() {
    console.log(this.newPollingOptions.length)
    console.log()
    let errMsg = ''
    if(!this.newPollingName) {
      errMsg += 'Polling name is required! \n'
    }
    if(!this.newPollingStartDate) {
      errMsg += 'Polling start date is required! \n'
    }
    if(this.newPollingOptions.length < 2) {
        errMsg += 'At least there are two options exist! \n'
    } 
    if (this.newPollingOptions.length == 2) {
      if (this.newPollingOptions[0].options == '' || this.newPollingOptions[1].options == '') {
        errMsg += 'At least there are two options exist! \n'
      }
    }
    if (errMsg) {
      this.functionMain.presentToast(errMsg, 'danger')
      return
    }
    let params = {
      polling_name: this.newPollingName,
      polling_start_date: this.newPollingStartDate,
      polling_end_date: this.newPollingEndDate,
      options: this.newPollingOptions.filter((polling: any) => polling.name !== ''),
      is_multiple_answer: this.newPollingIsMulti,
    }
    console.log(params)
    this.clientMainService.getApi(params, '/client/post/polling').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code == 200) {
          this.functionMain.presentToast('Successfully created a new polling!')
          this.loadPolling()
          this.toggleActive()
          this.resetForm()
        } else {
          this.functionMain.presentToast(`An error occurred while trying to create new polling!`, 'danger');
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while trying to create new polling!', 'danger');
        console.error(error);
      }
    });
  }

  resetForm() {
    this.newPollingName = ''
    this.newPollingStartDate = ''
    this.newPollingEndDate = ''
    this.newPollingIsMulti = false
    this.newPollingOptions = [
      {
        name: '',
        sequence: 0,
      }
    ]
  }

  dataForGraph: any = []

  onChangeOptions(num: number) {
    if (this.newPollingOptions[num].name == '') {
      if (this.newPollingOptions.length > 1) {
        this.newPollingOptions.splice(num, 1)
      }
    } else {
      this.newPollingOptions.push({name: '', sequence: 0})
    }
    
  }

  isLoading = false
  async loadPolling(){
    this.isLoading = true
    let params = {}
    if (this.isActive) {
      params = {page: this.currentPage, limit: this.functionMain.limitHistory, is_active: this.isActive}
    } else {
      params = {page: this.currentPage, limit: this.functionMain.limitHistory, is_active: this.isActive, issue_date: this.startDateFilter, end_issue_date: this.endDateFilter}
    }
    this.openVote = []
    this.closeVote = []
    this.showVotedata = []
    this.clientMainService.getApi(params, '/client/get/polling').subscribe({
      next: (results) => {
        this.isLoading = false
        console.log(results)
        if (results.result.response_code == 200) {
          if (this.isActive) {
            this.openVote = results.result.result
            this.showVotedata = this.openVote
          } else {
            this.closeVote = results.result.result
            this.showVotedata = this.closeVote
          }
          this.pagination = results.result.pagination
        } else if (results.result.response_code == 402)  {
          this.pagination = results.result.pagination
        } else {
          this.functionMain.presentToast(`An error occurred while loading polling data!`, 'danger');
          this.pagination = {}
        }
      },
      error: (error) => {
        this.isLoading = false
        this.functionMain.presentToast('An error occurred while loading polling data!', 'danger');
        this.pagination = {}
        console.error(error);
      }
    });
  }

  getTotal(vd: any) {
    let total = vd.reduce((sum: number, item: any) => sum + item.vote_count, 0);
    return total
  }

  getHighest(vd: any) {
    let max = Math.max(...vd.map((item: any) => item.vote_count));
    return max
  }

  getResult(vd: any) {
    let highestVote = Math.max(...vd.map((item: any) => item.vote_count));
    let optionsName = vd.filter((vote: any) => vote.vote_count == highestVote)

    return optionsName[0].options
  }

  handleRefresh(event: any) {
    this.loadPolling().then(() => event.target.complete())
  }

  onStartDateChange(value: Event) {
    const input = value.target as HTMLInputElement;
    this.startDateFilter = input.value;
    this.applyDateFilter();
  }

  onEndDateChange(value: Event) {
    const input = value.target as HTMLInputElement;
    this.endDateFilter = input.value;
    this.applyDateFilter();
  }

  resetFilter() {
    this.startDateFilter = '';
    this.endDateFilter = '';
    this.applyDateFilter()
  }

  startDateFilter = ''
  endDateFilter = ''

  applyDateFilter() {
    this.currentPage = 1
    this.inputPage = 1
    this.loadPolling()
  }

  currentPage = 1
  inputPage = 1
  total_pages = 0
  pagination: any = {}

  pageForward(page: number) {
    this.currentPage = page
    this.inputPage = page
    this.loadPolling()
  }

}
