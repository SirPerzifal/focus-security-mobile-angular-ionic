import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import {
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarWeekViewBeforeRenderEvent,
  CalendarDayViewBeforeRenderEvent
} from 'angular-calendar';
import { CalendarEventTitleFormatter } from 'angular-calendar';
import { CustomEventTitleFormatter } from 'src/utils/custom-event-title-formatter.providers';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { GetUserInfoService } from 'src/app/service/global/get-user-info/get-user-info.service';
import { AlertController } from '@ionic/angular';
import { BlockUnitService } from 'src/app/service/global/block_unit/block-unit.service';

@Component({
  selector: 'app-client-events-day-view',
  templateUrl: './client-events-day-view.page.html',
  styleUrls: ['./client-events-day-view.page.scss'],
  providers: [
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter,
    },
  ],
})
export class ClientEventsDayViewPage implements OnInit {

  faPlus = faPlus;

  ViewDate: Date = new Date(); // Tanggal yang akan ditampilkan
  Events: any[] = [];
  EventsForm = {
    id: 0,
    event_title: '',
    event_description: '',
    unit_id: '',
    block_id: '',
    start_date: '',
    end_date: '',
    project_id: '',
    facility_id: '',
    room_id: '',
    room_name: '',
    post_to: 'all',
    block_ids: [],
    unit_ids: [],
    host_ids: [],
    color: [] as string[],
  }

  selectedImage: string = '';

  isAddEventClick: boolean = false; // Menyimpan status modal
  isTaskClick: boolean = false; //
  // isBgOn: boolean = false; // Pastikan ini diinisialisasi di constructor atau di tempat yang sesuai

  private _selectedDate: string = '';

  task: any = [];
  hasTasks: boolean = false; // Menyimpan status apakah ada tugas
  showCompletedTasks: boolean = false; // Menyimpan status untuk menampilkan tugas yang diselesaikan
  newTaskTitle: string = ''; // Menyimpan judul tugas baru
  timeTask: string = '';
  snapDraggedEvents = true;

  isRead = false

  constructor(
    private router: Router, 
    private clientMainService: ClientMainService, 
    public functionMain: FunctionMainService, 
    private getUserInfoService: GetUserInfoService,
    private alertController: AlertController,
    private blockUnitService: BlockUnitService,
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { day: any };
    if (state) {
      this.ViewDate = state.day.date;
      if (this.ViewDate) {
        this.selectedDate = new Date(this.ViewDate.getTime() - (this.ViewDate.getTimezoneOffset() * 80000)).toISOString();
        console.log(this.selectedDate)
      }
    }
  }

  get selectedDate(): string {
    return this._selectedDate;
  }

  set selectedDate(value: string) {
    this._selectedDate = value;
    this.ViewDate = new Date(value); // Update ViewDate saat selectedDate berubah
    
  }

  addTask() {
    if (this.newTaskTitle.trim()) { // Pastikan input tidak kosong
      const newTask = {
        id: this.task.length + 1, // Atur ID baru (Anda mungkin ingin menggunakan cara yang lebih baik untuk mengelola ID)
        title: this.newTaskTitle,
        completed: false,
        due_date: this.timeTask, // Atur tanggal jatuh tempo (Anda bisa menyesuaikannya)
        day: this.ViewDate // Atur hari tugas baru (Anda bisa menyesuaikannya)
      };
      this.task.push(newTask); // Tambahkan tugas baru ke array
      this.newTaskTitle = ''; // Reset input
      this.isTaskClick = false;
      this.hasTasks = true
    }
  }

  ngOnInit() {
    this.functionMain.vmsPreferences().then((value) => {
      // console.log(value);
      console.log(value)
      // NOTE THIS SEMI HARD CODE
      this.EventsForm.block_id = value.block != null ? value.block : 1;
      this.EventsForm.project_id = value.project_id;
      this.EventsForm.unit_id = value.unit != null ? value.unit : 1
      this.project_id = value.project_id != null ? value.project_id : 1;
      this.project_config = value.config
      this.family_id = value.family_id
      this.loadFacilityList()
      this.loadUpcomingEvents()
      if (this.project_config.is_industrial) {
        this.loadHost()
        this.loadBook()
      } else {
        this.loadBlock()
        this.loadUnit()
      }
    })
  }

  project_config: any = {}

  family_id = ''
  Block: any = []
  Unit: any = []
  Host: any = []
  selectedHost: any = []

  loadHost() {
    this.clientMainService.getApi({ project_id: this.project_id }, '/industrial/get/family').subscribe((value: any) => {
      this.Host = value.result.result.map((item: any) => ({ id: item.id, name: item.host_name }));
    })
  }

  loadBlock() {
    this.blockUnitService.getBlock().subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Block = response.result.result.map((item: any) => {return {id: item.id, name: item.block_name}});
        } else {
          this.functionMain.presentToast('Failed to load block data', 'danger');
        }
      },
      error: (error) => {
        this.functionMain.presentToast('Error loading block data', 'danger');
        console.error('Error:', error);
      }
    });
  }

  loadUnit() {
    this.clientMainService.getApi({}, '/residential/get/all/units_by_project_id').subscribe({
      next: (response: any) => {
        if (response.result.status_code === 200) {
          this.Unit = response.result.result.map((item: any) => {return {id: item.id, name: item.unit_name}});
        } else {
          this.functionMain.presentToast('Failed to load unit data', 'danger');
          console.error('Error:', response.result);
        }
      },
      error: (error) => {
        this.functionMain.presentToast('Error loading unit data', 'danger');
        console.error('Error:', error.result);
      }
    });
  }

  unit_id = 1
  block_id = 1
  project_id = 751

  Facilities: any = []
  Rooms: any[] = []
  selectedFacility = 0
  facilityData: any
  loadFacilityList() {
    this.clientMainService.getApi({ unit_id: this.unit_id }, '/client/get/facilities_for_event').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.length > 0) {
          this.Facilities = results.result
        } else {
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while loading events!', 'danger');
        console.error(error);
      }
    });
  }

  onFacilityChange(event: any) {
    this.EventsForm.facility_id = event.target.value
    this.Rooms = this.Facilities.filter((item: any) => item.facility_id == event.target.value)[0].room_ids
    this.EventsForm.room_id = ''
    console.log(this.Rooms)
  }

  hostChange(event: any) {
    console.log(event)
    this.EventsForm.host_ids = event
  }

  unitChange(event: any) {
    console.log(event)
    this.EventsForm.unit_ids = event
  }

  blockChange(event: any) {
    console.log(event)
    this.EventsForm.block_ids = event
  }
  
  toggleTaskCompletion(task: any) {
    task.completed = !task.completed; // Toggle status completed
  }

  private routerSubscription!: Subscription;
  OnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  refresh = new Subject<void>();

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.refresh.next();
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

  eventClicked(event: any): void {
    this.isAddEventClick = true
    this.isRead = true
    console.log(event.event);
    this.EventsForm = {
      id: event.event.id,
      event_title: event.event.title,
      event_description: event.event.description,
      unit_id: this.EventsForm.unit_id,
      block_id: this.EventsForm.block_id,
      start_date: this.selectedDate,
      end_date: this.selectedDate,
      project_id: this.EventsForm.project_id,
      facility_id: event.event.facility_id,
      room_id: event.event.room_id,
      room_name: event.event.room_name,
      post_to: event.event.post_to,
      block_ids: event.event.block_ids,
      unit_ids: event.event.unit_ids,
      host_ids: event.event.host_ids,
      color: [] as string[],
    }
    this.selectedBookId = 0
    this.selectedBook = {}
    this.selectedHost = event.event.host_ids
    this.selectedBlock = event.event.block_ids
    this.selectedUnit = event.event.unit_ids
    this.Rooms = this.Facilities.filter((item: any) => item.facility_id == event.event.facility_id)[0].room_ids
    this.EventsForm.room_id = event.event.room_id

    this.selectedStartDate = event.event.start
    this.selectedEndDate = event.event.end

    this.selectedStartTime = `${event.event.start.getHours().toString().padStart(2, '0')}:${event.event.start.getMinutes().toString().padStart(2, '0')}`
    this.selectedEndTime = `${event.event.end.getHours().toString().padStart(2, '0')}:${event.event.end.getMinutes().toString().padStart(2, '0')}`
  }

  clickedDate(date: any): void {
    this.selectedStartDate = this.selectedDate;
    this.selectedEndDate = this.selectedDate;
    const dateString = date.toString();
    // Buat objek Date dari string
    const dateObj = new Date(dateString);

    // Ambil jam dan menit
    const hours = String(dateObj.getHours()).padStart(2, '0'); // Format jam
    const minutes = String(dateObj.getMinutes()).padStart(2, '0'); // Format menit

    // Gabungkan jam dan menit
    const formattedTime = `${hours}:${minutes}`;
    this.selectedStartTime = formattedTime;
  
    this.isAddEventClick = true;
    // console.log(this.EventsForm.start_date); 
  }

  selectedStartDate: string = '';
  selectedEndDate: string = '';
  selectedStartTime: string = ''; // Default value
  selectedEndTime: string = ''; // Default value


  onStartDateChange(event: any) {
    this.selectedStartDate = event.target.value;
    this.selectedEndDate = event.target.value;
  }

  onEndDateChange(event: any) {
    this.selectedEndDate = event.target.value;
  }

  onStartTimeChange(event: any): void {
    const [hours, minutes] = event.target.value.split(':');
    this.selectedStartTime = event.target.value;
    this.selectedEndTime = event.target.value;
    console.log(this.selectedStartTime)
    // setTimeout(() => {}, 0);
  }

  onEndTimeChange(event: any): void {
    const [hours, minutes] = event.target.value.split(':');
    this.selectedEndTime = event.target.value;
  }

  onChooseLabelColour(hexPrimary: string, hexSecondary: string): void {
    if (this.EventsForm.color.length > 0) {
      this.EventsForm.color.pop()
      this.EventsForm.color.pop()
    }
    this.EventsForm.color.push(hexPrimary)
    this.EventsForm.color.push(hexSecondary)
    console.log(this.EventsForm.color)
  }

  formatDate(date: Date, time: Date): string {
    // Format tanggal
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    // Format waktu
    const formattedTime = `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}`;

    // Gabungkan tanggal dan waktu menjadi string yang valid
    const dateTimeString = `${formattedDate}T${formattedTime}:00`; // Format ISO 8601

    // Buat objek Date dari string gabungan
    const now = new Date(dateTimeString);

    // Mendapatkan offset zona waktu dalam menit
    const timezoneOffset = now.getTimezoneOffset(); // Offset dalam menit

    // Menghitung waktu lokal dengan menyesuaikan offset
    const localDate = new Date(now.getTime()); // Mengonversi menit ke milidetik

    // Format tanggal menjadi string
    const formattedDateResult = localDate.toString(); // Menghasilkan format seperti "Sat Feb 08 2025 01:00:00 GMT+0700 (Western Indonesia Time)"
    return formattedDateResult;
  }

  createEvent() {
    if (this.selectedDate && this.selectedStartTime) {
      const startDate = new Date(this.selectedDate); // Mengonversi string ke Date
      const startTime = new Date(`1970-01-01T${this.selectedStartTime}:00`); // Mengonversi waktu ke Date
      this.EventsForm.start_date = this.formatDate(startDate, startTime);
    }
    if (this.selectedDate && this.selectedEndTime) {
      const endDate = new Date(this.selectedDate); // Mengonversi string ke Date
      const endTime = new Date(`1970-01-01T${this.selectedEndTime}:00`); // Mengonversi waktu ke Date
      this.EventsForm.end_date = this.formatDate(endDate, endTime);
    }
    let errMsg = ''
    if (!this.EventsForm.event_title) {
      errMsg += 'Title is required! \n'
    }
    if (this.selectedBookId == 0) {
      errMsg += 'Booking is required! \n'
    }
    if (this.EventsForm.facility_id == '') {
      errMsg += 'Facility is required! \n'
    }
    if (this.EventsForm.room_id == '') {
      errMsg += 'Room is required! \n'
    }
    if (this.EventsForm.post_to == 'block' && this.EventsForm.block_ids.length == 0 && !this.project_config.is_industrial) {
      errMsg += 'At least one block must be selected! \n'
    }
    if (this.EventsForm.post_to == 'unit' && this.EventsForm.unit_ids.length == 0 && !this.project_config.is_industrial) {
      errMsg += 'At least one unit must be selected! \n'
    }
    if (this.EventsForm.host_ids.length == 0 && this.project_config.is_industrial) {
      errMsg += 'At least one host must be selected! \n'
    }
    if (!this.selectedStartTime) {
      errMsg += 'Start time must be selected! \n'
    }
    if (!this.selectedEndTime) {
      errMsg += 'End time must be selected! \n'
    }
    if (this.functionMain.timeToInt(this.selectedEndTime) <= this.functionMain.timeToInt(this.selectedStartTime)) {
      errMsg += "Close Hour can't be the same as or less than open hour! \n"
    }
    if (this.EventsForm.color.length == 0) {
      errMsg += 'Label color must be selected! \n'
    }
    console.log(this.selectedStartTime, this.selectedStartTime)
    console.log(this.EventsForm);
    
    if (errMsg == ''){
      this.clientMainService.getApi(this.EventsForm, '/client/post/client_upcoming_event').subscribe({
        next: (results) => {
          console.log(results)
          if (results.result.response_code == 200) {
            this.functionMain.presentToast(`Successfully add events!`, 'success');
            this.isAddEventClick = false
            this.loadUpcomingEvents()
            this.EventsForm.event_title = ''
            this.EventsForm.event_description = ''
            this.EventsForm.color = []
          } else {
            this.functionMain.presentToast(`An error occurred while trying to create new event!`, 'danger');
          }
        },
        error: (error) => {
          this.functionMain.presentToast('An error occurred while trying to create new event!', 'danger');
          console.error(error);
        }
      });
    } else {
      this.functionMain.presentToast(errMsg, 'danger')
    }
    
  }

  selectedBlock: any = []
  selectedUnit: any = []
  isLoading = false
  async loadUpcomingEvents() {
    this.isLoading = true
    const now = new Date();
    this.clientMainService.getApi({ is_active: false }, '/client/get/upcoming_event').subscribe({
      next: (results) => {
        this.isLoading = false
        console.log(results)
        this.Events = []
        if (results.result.response_code == 200) {
          const newEvents = results.result.result.map((result: any) => ({
            id: result.id,
            start: new Date(result.start_date), // 12:00 PM
            end: new Date(result.end_date), // 1:00 PM
            title: result.event_title ? result.event_title : result.registered_coach_facility_name + ' - ' +  result.room_name,
            description: result.event_description,
            facility_id: result.registered_coach_facility_id,
            room_id: result.room_id,
            room_name: result.room_name,
            post_to: result.post_to,
            block_ids: result.block_ids,
            unit_ids: result.unit_ids,
            host_ids: result.host_ids,
            color: { primary: result.secondary_color_hex_code, secondary: result.primary_color_hex_code },
            resizable: {
              beforeStart: false,
              afterEnd: false,
            },
          }));
  
          // Ganti array Events dengan referensi baru agar Angular mendeteksi perubahan
          this.Events = [...newEvents];
  
          console.log(this.Events);
        } else if (results.result.response_code == 402)  {
        } else {
          this.functionMain.presentToast(`An error occurred while loading events!`, 'danger');
        }
      },
      error: (error) => {
        this.isLoading = false
        this.functionMain.presentToast('Failed!', 'danger');
        console.error(error);
      }
    });
  }


  openNewModal() {
    this.Rooms = []
    this.isAddEventClick = true
    this.isRead = false
    this.EventsForm = {
      id: 0,
      event_title: '',
      event_description: '',
      unit_id: this.EventsForm.unit_id,
      block_id: this.EventsForm.block_id,
      start_date: '',
      end_date: '',
      project_id: this.EventsForm.project_id,
      color: [] as string[],
      facility_id: '',
      room_id: '',
      room_name: '',
      post_to: 'all',
      block_ids: [],
      unit_ids: [],
      host_ids: [],
    }
    this.selectedHost = []
    this.selectedBlock = []
    this.selectedUnit = []
    this.selectedEndTime = ''
    this.selectedStartTime = ''
    this.selectedStartDate = this.selectedDate
    this.selectedEndDate = this.selectedDate
    this.selectedBookId = 0
    this.selectedBook = {}
  }

  onClose() {
    this.isAddEventClick = false
    this.Rooms = []
    this.EventsForm = {
      id: 0,
      event_title: '',
      event_description: '',
      unit_id: this.EventsForm.unit_id,
      block_id: this.EventsForm.block_id,
      start_date: '',
      end_date: '',
      project_id: this.EventsForm.project_id,
      color: [] as string[],
      facility_id: '',
      room_id: '',
      room_name: '',
      post_to: 'all',
      block_ids: [],
      unit_ids: [],
      host_ids: [],
    }
    this.selectedBookId = 0
    this.selectedBook = {}
    this.selectedHost = []
    this.selectedBlock = []
    this.selectedUnit = []
    this.isRead = false
    this.selectedEndTime = ''
    this.selectedStartTime = ''
  }

  async onCancel() {
    const alertButtons = await this.alertController.create({
      cssClass: 'custom-alert-class-resident-visitors-page',
      header: `Are you sure you want to cancel this event?`,
      buttons: [
        {
          text: 'Confirm',
          cssClass: 'confirm-button',
          handler: () => {
            this.cancelupcomingEvent()
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'cancel-button',
          handler: () => {
          },
        },
      ]
    }
    )
    await alertButtons.present();
  }

  cancelupcomingEvent() {
    if (this.EventsForm.id != 0) {
      this.clientMainService.getApi({ event_id: this.EventsForm.id, is_client: true }, '/resident/post/delete_upcoming_event').subscribe({
        next: (results) => {
          console.log(results)
          if (results.result.response_code == 200) {
            this.onClose()
            this.loadUpcomingEvents()
            this.functionMain.presentToast(`Successfully cancel the event!`, 'success');
          } else {
            this.functionMain.presentToast(`An error occurred while cancelling the event!`, 'danger');
          }
        },
        error: (error) => {
          this.functionMain.presentToast('An error occurred while cancelling the event!', 'danger');
          console.error(error);
        }
      });
    } else {
      this.functionMain.presentToast('Event id not found!')
    }
    
  }

  onBack() {
    this.router.navigate(['/client-upcoming-events'], {
      queryParams: {reload: true}
    })
  }

  handleRefresh(event: any) {
    this.loadUpcomingEvents().then(() => event.target.complete())
  }

  onBookChange(event: any) {
    console.log(event.target.value) 
    this.selectedBook = this.BookingResult.filter((item: any) => item.id == this.selectedBookId)[0]
    this.selectedStartTime = (this.selectedBook.start_datetime).split(' ')[1]
    this.selectedEndTime = (this.selectedBook.stop_datetime).split(' ')[1]
    this.EventsForm.facility_id = this.selectedBook.facility_id
    this.Rooms = this.Facilities.filter((item: any) => item.facility_id == this.EventsForm.facility_id)[0].room_ids
    this.EventsForm.room_id = this.selectedBook.room_id
    console.log(this.selectedBook)
  }
  
  BookingResult: any = []
  selectedBook: any = {}
  selectedBookId = 0

  loadBook() {
    this.selectedBookId = 0
    this.selectedBook = {}
    this.BookingResult = []
    let dateObj = new Date(this.selectedDate);
    let localDateOnly = dateObj.toLocaleDateString('en-CA'); 
    let params = {
      selected_date: localDateOnly,
      host_id: this.family_id,
      is_client: true,
    }
    console.log(params)
    this.clientMainService.getApi(params, '/resident/get/room_booking_based_on_host_id').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code == 200) {
          this.BookingResult = results.result.result_booking
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while trying to get booking data!', 'danger');
        console.error(error);
      }
    });
  }

}
