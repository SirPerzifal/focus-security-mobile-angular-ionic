import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import {
  CalendarEventTimesChangedEvent,
} from 'angular-calendar';
import { CalendarEventTitleFormatter } from 'angular-calendar';
import { AlertController } from '@ionic/angular';

import { CustomEventTitleFormatter } from 'src/utils/custom-event-title-formatter.providers';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { MainApiResidentService } from 'src/app/service/resident/main/main-api-resident.service';
import { Estate } from 'src/models/resident/resident.model';
import { StorageService } from 'src/app/service/storage/storage.service';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';

@Component({
  selector: 'app-make-a-new-event',
  templateUrl: './make-a-new-event.page.html',
  styleUrls: ['./make-a-new-event.page.scss'],
  providers: [
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter,
    },
  ],
})
export class MakeANewEventPage implements OnInit {

  faPlus = faPlus;

  ViewDate: Date = new Date(); // Tanggal yang akan ditampilkan
  Events: any[] = [];
  EventsForm = {
    id: 0,
    event_description: '',
    registered_coach_id: 0,
    start_date: '',
    facility_name: '',
    facility_id: '',
    contact_number: '',
    vehicle_number: '',
    room_name: '',
    room_id: '',
    coach_type: '',
    end_date: '',
    post_to: 'all',
    block_ids: [],
    unit_ids: [],
    host_ids: [],
    color: ['#3b82f6', '#1d4ed8'] as string[],
    is_update: false,
  }

  isAddEventClick: boolean = false; // Menyimpan status modal

  private _selectedDate: string = '';

  snapDraggedEvents = true;

  isRead = false

  constructor(
    private router: Router,
    public functionMain: FunctionMainService,
    private alertController: AlertController,
    private mainApi: MainApiResidentService,
    private storage: StorageService,
    private clientMainService: ClientMainService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { day: any };
    if (state) {
      this.ViewDate = state.day.date;
      if (this.ViewDate) {
        this.selectedDate = new Date(this.ViewDate.getTime() - (this.ViewDate.getTimezoneOffset() * 80000)).toISOString();
        // console.log(this.selectedDate)
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

  userData: any = {}

  loadStorage() {
    this.storage.getValueFromStorage('USESATE_DATA').then((value: any) => {
      this.storage.decodeData(value).then((value: any) => {
        if ( value ) {
          const estate = JSON.parse(value) as Estate;
          this.userData = estate
          console.log(this.userData)
        }
        })
      })
  }

  ngOnInit() {
    this.loadStorage()
    this.loadRegisteredCoach()
    this.loadUpcomingEvents()
    this.loadFacilityList()
    // if (this.userType == 'industrial') {
    //   this.loadHost()
    // }
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
    // console.log(this.isRead)
    // console.log(event.event);
    this.EventsForm = {
      id: event.event.id,
      event_description: event.event.description,
      registered_coach_id: event.event.registered_coach_id ? event.event.registered_coach_id : 0,
      start_date: this.selectedDate,
      facility_name: event.event.facility_name,
      facility_id: event.event.facility_id,
      contact_number: event.event.contact_number,
      vehicle_number: event.event.vehicle_number,
      end_date: this.selectedDate,
      color: ['#3b82f6', '#1d4ed8'] as string[],
      post_to: event.event.post_to,
      block_ids: event.event.block_ids,
      unit_ids: event.event.unit_ids,
      host_ids: event.event.host_ids,
      coach_type: event.event.coach_type,
      room_name: event.event.room_name,
      room_id: '',
      is_update: false,
    }
    this.selectedBook = {}
    this.selectedBookId = 0
    // this.BookingResult = []
    this.selectedHost = event.event.host_ids
    console.log(this.selectedHost)
    this.Rooms = this.Facilities.filter((item: any) => item.facility_id === event.event.facility_id)[0].room_ids
    this.EventsForm.room_id = event.event.room_id
    this.isCoachData = Boolean(this.EventsForm.registered_coach_id)
    this.event_title = event.event.title  ? event.event.title : event.event.facility_name
    this.selectedStartDate = this.selectedDate
    this.selectedEndDate = this.selectedDate
    this.selectedStartTime = `${event.event.start.getHours().toString().padStart(2, '0')}:${event.event.start.getMinutes().toString().padStart(2, '0')}`
    this.selectedEndTime = `${event.event.end.getHours().toString().padStart(2, '0')}:${event.event.end.getMinutes().toString().padStart(2, '0')}`
  }

  isCoachData = false
  event_title = ''

  clickedDate(date: any): void {
    this.isCoachData = true
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
    this.selectedBook = {}
    this.selectedBookId = 0
    // this.BookingResult = []
    this.selectedHost = [this.userData.family_id]
    // // console.log(this.EventsForm.start_date); 
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
    // Format the time to AM/PM if needed
    const [hours, minutes] = event.target.value.split(':');
    const formattedTime = `${(+hours % 12 || 12)}:${minutes} ${+hours < 12 ? 'AM' : 'PM'}`;
    // console.log(formattedTime)
    this.selectedStartTime = event.target.value;
    this.formatEnd(this.selectedStartTime)
  }

  formatEnd(time: string) {
    const [hours, minutes] = time.split(':');
    const totalMinutes = parseInt(hours) * 60 + parseInt(minutes) + parseInt(this.coachData.duration_per_session);
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = totalMinutes % 60;

    // Simpan dalam format "HH:mm" untuk kompatibilitas dengan input[type="time"]
    this.selectedEndTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;

    // console.log(this.selectedStartTime)
    // console.log(hours, minutes)
    // console.log(this.coachData.duration_per_session)
    // console.log(totalMinutes, endHours, endMinutes, this.selectedEndTime)
  }

  onEndTimeChange(event: any): void {
    // Format the time to AM/PM if needed
    const [hours, minutes] = event.target.value.split(':');
    const formattedTime = `${(+hours % 12 || 12)}:${minutes} ${+hours < 12 ? 'AM' : 'PM'}`;
    this.selectedEndTime = event.target.value;
  }

  // onImageChange(value: any): void {
  //   let data = value.target.files[0];
  //   if (data) {
  //     this.selectedImage = data.name; // Store the selected file name
  //     this.convertToBase64(data).then((base64: string) => {
  //       // console.log('Base64 successed');
  //       this.EventsForm.image = base64.split(',')[1]; // Update the form control for image file
  //     }).catch(error => {
  //       console.error('Error converting to base64', error);
  //     });
  //   } else {
  //     this.selectedImage = ''; // Reset if no file is selected
  //   }
  // }

  onChooseLabelColour(hexPrimary: string, hexSecondary: string): void {
    if (this.EventsForm.color.length > 0) {
      this.EventsForm.color.pop()
      this.EventsForm.color.pop()
    }
    this.EventsForm.color.push(hexPrimary)
    this.EventsForm.color.push(hexSecondary)
    // console.log(this.EventsForm.color)
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

  submitForm() {
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
    if (this.EventsForm.registered_coach_id == 0 && this.userType != 'industrial') {
      errMsg += 'Coach must be selected! \n'
    }
    if (this.EventsForm.facility_id == '') {
      errMsg += 'Facility is required! \n'
    }
    if (this.EventsForm.room_id == '') {
      errMsg += 'Room is required! \n'
    }
    if (this.selectedBookId == 0 && this.userType == 'industrial') {
      errMsg += 'Booking is required! \n'
    }
    if (!this.EventsForm.contact_number && this.userType != 'industrial') {
      errMsg += 'Contact number is required! \n'
    }
    if (!this.EventsForm.vehicle_number && this.userType != 'industrial') {
      errMsg += 'Vehicle number is required! \n'
    }
    if (!this.selectedStartTime) {
      errMsg += 'Start time must be selected! \n'
    }
    if (!this.selectedEndTime) {
      errMsg += 'End time must be selected! \n'
    }
    if (this.EventsForm.color.length == 0) {
      errMsg += 'Label color must be selected! \n'
    }
    if (this.EventsForm.color.length == 0) {
      errMsg += 'Label color must be selected! \n'
    }
    // console.log(this.EventsForm);

    if (errMsg == '') {
      if (this.userType == 'industrial'){
        this.createEvent()
      } else {
        if ((this.EventsForm.contact_number == this.coachData.contact_number)) {
          this.createEvent()
          // console.log("DATA SAME")
        } else {
          this.openContactNumberModal()
          // console.log("DATA NOT SAME");
        }
      }
    } else {
      this.functionMain.presentToast(errMsg, 'danger')
    }
  }

  coachType = ''

  createEvent() {
    console.log(this.EventsForm)
    this.mainApi.endpointMainProcess(
      this.EventsForm
    , 'post/upcoming_event').subscribe((response: any) => {
      console.log(response)
      if (response.result.response_code == 200) {
        this.functionMain.presentToast(`Successfully add events!`, 'success');
        this.isAddEventClick = false
        this.loadUpcomingEvents()
        this.loadRegisteredCoach()
        this.EventsForm.event_description = ''
        this.EventsForm.registered_coach_id = 0
        this.EventsForm.color = ['#3b82f6', '#1d4ed8']
      } else {
        this.functionMain.presentToast(`Failed!`, 'danger');
      }
    })

  }

  async loadUpcomingEvents() {
    const now = new Date();
    this.mainApi.endpointMainProcess({}, 'get/upcoming_event').subscribe((response: any) => {
      console.log(response)
      if (response.result.response_code == 200) {
        const newEvents = response.result.result.map((result: any) => ({
          id: result.id,
          start: new Date(result.start_date), // 12:00 PM
          end: new Date(result.end_date), // 1:00 PM
          title: result.event_title ? result.event_title : result.registered_coach_facility_name + ' - ' +  result.room_name,
          description: result.event_description,
          registered_coach_id: result.registered_coach_id,
          facility_name: result.registered_coach_facility_name,
          facility_id: result.registered_coach_facility_id,
          contact_number: result.coach_contact_number,
          coach_type: result.registered_coach_type,
          vehicle_number: result.coach_vehicle_number,
          room_name: result.room_name,
          room_id: result.room_id,
          post_to: result.post_to,
          block_ids: result.block_ids,
          unit_ids: result.unit_ids,
          host_ids: result.host_ids,
          color: { primary: result.secondary_color_hex_code, secondary: result.primary_color_hex_code },
          resizable: {
            beforeStart: true,
            afterEnd: true,
          },
        }));
        console.log(newEvents)
        // Ganti array Events dengan referensi baru agar Angular mendeteksi perubahan
        this.Events = [...newEvents];

        // console.log(this.Events);
      } else {
      }
    })
  }

  Coach: any[] = []
  selectedCoach = 0
  coachData: any
  loadRegisteredCoach() {
    if (this.userType == 'industrial') return
    this.mainApi.endpointMainProcess({}, 'get/registered_coaches_based_on_unit').subscribe((response: any) => {
      // console.log(results)
      if (response.result.response_code == 200) {
        if (response.result.response_result.length > 0) {
          this.Coach = response.result.response_result
        } else {
        }
        // this.functionMain.presentToast(`Success!`, 'success');
      } else {
        this.functionMain.presentToast(`An error occurred while loading coach data!`, 'danger');
      }
    })
  }
  
  Facilities: any[] = []
  selectedFacility = 0
  facilityData: any
  loadFacilityList() {
    this.mainApi.endpointMainProcess({}, 'get/facilities').subscribe((response: any) => {
        // console.log(results)
        if (response.result.length > 0) {
          this.Facilities = response.result
        } else {
        }
    })
  }

  Rooms: any = []
  onFacilityChange(event: any) {
    this.EventsForm.facility_id = event.target.value
    this.Rooms = this.Facilities.filter((item: any) => item.facility_id == this.EventsForm.facility_id)[0].room_ids
    // console.log(this.EventsForm.facility_id)
    // console.log(this.Rooms)
  }

  onCoachChange(event: any) {
    this.EventsForm.registered_coach_id = event.target.value;
    this.coachData = this.Coach.filter((coach: any) => coach.id == this.selectedCoach)
    this.coachData = this.coachData[0]
    this.EventsForm.facility_name = this.coachData.facility_name
    this.EventsForm.coach_type = this.coachData.coach_type
    this.EventsForm.facility_id = this.coachData.facility_id
    this.EventsForm.contact_number = this.coachData.contact_number
    this.EventsForm.vehicle_number = this.coachData.vehicle_number
    this.Rooms = this.Facilities.filter((item: any) => item.facility_id == this.EventsForm.facility_id)[0].room_ids
    // console.log(this.coachData)
    if (this.selectedStartTime) {
      this.formatEnd(this.selectedStartTime)
    }
  }

  openNewModal() {
    console.log(this.userType)
    this.isAddEventClick = true
    this.isRead = false
    this.Rooms = []
    this.isCoachData = true
    this.EventsForm = {
      id: 0,
      event_description: '',
      registered_coach_id: 0,
      facility_name: '',
      contact_number: '',
      vehicle_number: '',
      facility_id: '',
      start_date: '',
      end_date: '',
      coach_type: '',
      room_name: '',
      room_id: '',
      post_to: 'all',
      block_ids: [],
      unit_ids: [],
      host_ids: [],
      color: ['#3b82f6', '#1d4ed8'] as string[],
      is_update: false,
    }
    this.selectedHost = [this.userData.family_id]
    this.selectedEndTime = ''
    this.selectedStartTime = ''
    this.event_title = ''
    this.selectedStartDate = this.selectedDate
    this.selectedEndDate = this.selectedDate
    this.selectedBook = {}
    this.selectedBookId = 0
    // this.BookingResult = []
  }

  onClose() {
    this.Rooms = []
    this.isAddEventClick = false
    this.EventsForm = {
      id: 0,
      event_description: '',
      registered_coach_id: 0,
      start_date: '',
      facility_name: '',
      contact_number: '',
      facility_id: '',
      vehicle_number: '',
      end_date: '',
      coach_type: '',
      room_name: '',
      room_id: '',
      post_to: 'all',
      block_ids: [],
      unit_ids: [],
      host_ids: [],
      color: ['#3b82f6', '#1d4ed8'] as string[],
      is_update: false,
    }
    this.selectedHost = []
    this.isRead = false
    this.event_title = ''
    this.selectedEndTime = ''
    this.selectedStartTime = ''
    this.selectedBook = {}
    this.selectedBookId = 0
    // this.BookingResult = []
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
      this.mainApi.endpointMainProcess({ event_id: this.EventsForm.id }, 'post/delete_upcoming_event').subscribe((response: any) => {
        // console.log(results)
        if (response.result.response_code == 200) {
          this.onClose()
          this.loadUpcomingEvents()
          this.functionMain.presentToast(`Successfully cancel the event!`, 'success');
        } else {
          this.functionMain.presentToast(`An error occurred while cancelling the event!`, 'danger');
        }
      })
    } else {
      this.functionMain.presentToast('Event id not found!')
    }

  }

  onBack() {
    this.router.navigate(['/upcoming-event-page-main'], {
      queryParams: { reload: true }
    })
  }

  contactNumberModal = false
  closeContactNumberModal() {
    this.contactNumberModal = false
  }

  openContactNumberModal() {
    this.contactNumberModal = true
  }

  oneUse() {
    this.createEvent()
    this.contactNumberModal = false
  }

  updateContact() {
    this.EventsForm.is_update = true
    this.createEvent()
    this.contactNumberModal = false
    this.loadRegisteredCoach()
  }

  hostChange(event: any) {
    console.log(event)
    this.EventsForm.host_ids = event
  }

  Host: any = []
  selectedHost: any = []

  loadHost() {
    this.mainApi.endpointMainProcess({}, 'get/family').subscribe((value: any) => {
      console.log(value)
      this.Host = value.result.result.map((item: any) => ({ id: item.id, name: item.host_name }));
    })
  }

  userType = ''
  getTypeUser(event: any) {
    this.userType = event;
    console.log(this.userType)
    if (this.userType == 'industrial') {
      this.loadHost()
      this.loadBook()
    }
  }

  BookingResult: any = []
  selectedBook: any = {}
  selectedBookId = 0
  onRoomChange(event: any) {
    console.log(event.target.value)
    this.EventsForm.room_id = event.target.value
    // this.BookingResult = []
  }

  loadBook() {
    this.selectedBookId = 0
    this.selectedBook = {}
    this.BookingResult = []
    let dateObj = new Date(this.selectedDate);
    let localDateOnly = dateObj.toLocaleDateString('en-CA'); 
    let params = {
      host_id: this.userData.family_id,
      selected_date: localDateOnly
    }
    console.log(params)
    this.clientMainService.getApi(params, '/residential/get/room_booking_based_on_host_id').subscribe({
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

  onBookChange(event: any) {
    console.log(event.target.value) 
    this.selectedBook = this.BookingResult.filter((item: any) => item.id == this.selectedBookId)[0]
    this.selectedStartTime = (this.selectedBook.start_datetime).split(' ')[1]
    this.selectedEndTime = (this.selectedBook.stop_datetime).split(' ')[1]
    this.EventsForm.facility_id = this.selectedBook.facility_id
    this.Rooms = this.Facilities.filter((item: any) => item.facility_id == this.EventsForm.facility_id)[0].room_ids
    if (this.userType) {
      this.EventsForm.room_id = this.selectedBook.room_id
    }
    console.log(this.selectedBook)
  }


}
