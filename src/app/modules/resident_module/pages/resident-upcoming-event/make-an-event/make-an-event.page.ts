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
import { Preferences } from '@capacitor/preferences';
import { CalendarEventTitleFormatter } from 'angular-calendar';
import { CustomEventTitleFormatter } from 'src/utils/custom-event-title-formatter.providers';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { GetUserInfoService } from 'src/app/service/global/get-user-info/get-user-info.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-make-an-event',
  templateUrl: './make-an-event.page.html',
  styleUrls: ['./make-an-event.page.scss'],
  providers: [
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter,
    },
  ],
})
export class MakeAnEventPage implements OnInit {

  faPlus = faPlus;

  ViewDate: Date = new Date(); // Tanggal yang akan ditampilkan
  Events: any[] = [];
  EventsForm = {
    id: 0,
    event_description: '',
    registered_coach_id: 0,
    unit_id: '',
    block_id: '',
    start_date: '',
    facility_name: '',
    facility_id: '',
    contact_number: '',
    vehicle_number: '',
    room_name: '',
    room_id: '',
    coach_type: '',
    end_date: '',
    family_id: 0,
    project_id: '',
    post_to: 'all',
    block_ids: [],
    unit_ids: [],
    color: ['#3b82f6', '#1d4ed8'] as string[],
    is_update: false,
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
    Preferences.get({key: 'USESTATE_DATA'}).then(async (value) => {
      if (value?.value) {
        const parseValue = JSON.parse(value.value);
        console.log(parseValue)
        this.EventsForm.block_id = parseValue.block_id != null ? parseValue.block_id : 1;
        this.EventsForm.project_id = parseValue.project_id != null ? parseValue.project_id : 1;
        this.EventsForm.unit_id = parseValue.unit_id != null ? parseValue.unit_id : 1
        this.block_id = parseValue.block_id != null ? parseValue.block_id : 1;
        this.project_id = parseValue.project_id != null ? parseValue.project_id : 1;
        this.unit_id = parseValue.unit_id != null ? parseValue.unit_id : 1
        this.EventsForm.family_id = parseValue.family_id != null ? parseValue.family_id : 1
        // console.log(this.project_id, this.block_id, this.unit_id)
        this.loadRegisteredCoach()
        this.loadUpcomingEvents()
        this.loadFacilityList()
      }
    })
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
      unit_id: this.EventsForm.unit_id,
      block_id: this.EventsForm.block_id,
      start_date: this.selectedDate,
      facility_name: event.event.facility_name,
      facility_id: event.event.facility_id,
      contact_number: event.event.contact_number,
      vehicle_number: event.event.vehicle_number,
      end_date: this.selectedDate,
      family_id: this.EventsForm.family_id,
      project_id: this.EventsForm.project_id,
      color: ['#3b82f6', '#1d4ed8'] as string[],
      post_to: event.event.post_to,
      block_ids: event.event.block_ids,
      unit_ids: event.event.unit_ids,
      coach_type: event.event.coach_type,
      room_name: event.event.room_name,
      room_id: '',
      is_update: false,
    }
    this.Rooms = this.Facilities.filter((item: any) => item.facility_id === event.event.facility_id)[0].room_ids
    this.EventsForm.room_id = event.event.room_id
    this.isCoachData = Boolean(this.EventsForm.registered_coach_id)
    this.event_title = event.event.title
    this.selectedStartDate = this.selectedDate
    this.selectedEndDate = this.selectedDate
    this.selectedStartTime = `${event.event.start.getHours().toString().padStart(2, '0')}:${event.event.start.getMinutes().toString().padStart(2, '0')}`
    this.selectedEndTime = `${event.event.end.getHours().toString().padStart(2, '0')}:${event.event.end.getMinutes().toString().padStart(2, '0')}`
  }

  isCoachData = false
  event_title = ''

  unit_id = 1
  block_id = 1
  project_id = 751

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
    if (this.EventsForm.registered_coach_id == 0) {
      errMsg += 'Coach must be selected! \n'
    }
    if (this.EventsForm.facility_id == '') {
      errMsg += 'Facility is required! \n'
    }
    if (this.EventsForm.room_id == '') {
      errMsg += 'Room is required! \n'
    }
    if (!this.EventsForm.contact_number) {
      errMsg += 'Contact number is required! \n'
    }
    if (!this.EventsForm.vehicle_number) {
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
      if (this.EventsForm.contact_number == this.coachData.contact_number) {
        this.createEvent()
        // console.log("DATA SAME")
      } else {
        this.openContactNumberModal()
        // console.log("DATA NOT SAME");
      }
    } else {
      this.functionMain.presentToast(errMsg, 'danger')
    }
  }

  coachType = ''

  createEvent() {
    console.log(this.EventsForm)
    this.clientMainService.getApi(this.EventsForm, '/resident/post/upcoming_event').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code == 200) {
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
      },
      error: (error) => {
        this.functionMain.presentToast('Failed!', 'danger');
        console.error(error);
      }
    });

  }

  async loadUpcomingEvents() {
    const now = new Date();
    this.clientMainService.getApi({ unit_id: this.unit_id }, '/resident/get/upcoming_event').subscribe({
      next: (results) => {
        // console.log(results)
        if (results.result.response_code == 200) {
          const newEvents = results.result.result.map((result: any) => ({
            id: result.id,
            start: new Date(result.start_date), // 12:00 PM
            end: new Date(result.end_date), // 1:00 PM
            title: result.event_title,
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
            color: { primary: result.secondary_color_hex_code, secondary: result.primary_color_hex_code },
            resizable: {
              beforeStart: true,
              afterEnd: true,
            },
          }));

          // Ganti array Events dengan referensi baru agar Angular mendeteksi perubahan
          this.Events = [...newEvents];

          // console.log(this.Events);
        } else {
        }
      },
      error: (error) => {
        this.functionMain.presentToast('Failed!', 'danger');
        console.error(error);
      }
    });
  }

  Coach: any[] = []
  selectedCoach = 0
  coachData: any
  loadRegisteredCoach() {
    // console.log(this.unit_id)
    this.clientMainService.getApi({ unit_id: this.unit_id }, '/resident/get/registered_coaches_based_on_unit_id').subscribe({
      next: (results) => {
        // console.log(results)
        if (results.result.response_code == 200) {
          if (results.result.response_result.length > 0) {
            this.Coach = results.result.response_result
          } else {
          }
          // this.functionMain.presentToast(`Success!`, 'success');
        } else {
          this.functionMain.presentToast(`An error occurred while loading coach data!`, 'danger');
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while loading coach data!', 'danger');
        console.error(error);
      }
    });
  }
  
  Facilities: any[] = []
  selectedFacility = 0
  facilityData: any
  loadFacilityList() {
    this.clientMainService.getApi({ unit_id: this.unit_id }, '/resident/get/facilities').subscribe({
      next: (results) => {
        // console.log(results)
        if (results.result.length > 0) {
          this.Facilities = results.result
        } else {
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while loading coach data!', 'danger');
        console.error(error);
      }
    });
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
    this.isAddEventClick = true
    this.isRead = false
    this.Rooms = []
    this.isCoachData = true
    this.EventsForm = {
      id: 0,
      event_description: '',
      registered_coach_id: 0,
      unit_id: this.EventsForm.unit_id,
      block_id: this.EventsForm.block_id,
      facility_name: '',
      contact_number: '',
      vehicle_number: '',
      family_id: this.EventsForm.family_id,
      facility_id: '',
      start_date: '',
      end_date: '',
      coach_type: '',
      room_name: '',
      room_id: '',
      post_to: 'all',
      block_ids: [],
      unit_ids: [],
      project_id: this.EventsForm.project_id,
      color: ['#3b82f6', '#1d4ed8'] as string[],
      is_update: false,
    }
    this.selectedEndTime = ''
    this.selectedStartTime = ''
    this.event_title = ''
    this.selectedStartDate = this.selectedDate
    this.selectedEndDate = this.selectedDate
  }

  onClose() {
    this.Rooms = []
    this.isAddEventClick = false
    this.EventsForm = {
      id: 0,
      event_description: '',
      registered_coach_id: 0,
      unit_id: this.EventsForm.unit_id,
      block_id: this.EventsForm.block_id,
      start_date: '',
      facility_name: '',
      contact_number: '',
      family_id: this.EventsForm.family_id,
      facility_id: '',
      vehicle_number: '',
      end_date: '',
      coach_type: '',
      room_name: '',
      room_id: '',
      post_to: 'all',
      block_ids: [],
      unit_ids: [],
      project_id: this.EventsForm.project_id,
      color: ['#3b82f6', '#1d4ed8'] as string[],
      is_update: false,
    }
    this.isRead = false
    this.event_title = ''
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
      this.clientMainService.getApi({ event_id: this.EventsForm.id }, '/resident/post/delete_upcoming_event').subscribe({
        next: (results) => {
          // console.log(results)
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
    this.router.navigate(['/upcoming-event-calendar-view'], {
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

}
