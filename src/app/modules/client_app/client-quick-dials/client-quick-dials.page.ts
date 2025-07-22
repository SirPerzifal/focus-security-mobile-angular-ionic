import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { faGear, faPhone } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { trigger, style, animate, transition } from '@angular/animations';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { AlertController } from '@ionic/angular';
import { WebRtcService } from 'src/app/service/fs-web-rtc/web-rtc.service';

@Component({
  selector: 'app-client-quick-dials',
  templateUrl: './client-quick-dials.page.html',
  styleUrls: ['./client-quick-dials.page.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class ClientQuickDialsPage implements OnInit {

  constructor(private router: Router, private clientMainService: ClientMainService, public functionMain: FunctionMainService, private alertController: AlertController, private webRtcService: WebRtcService) { }

  ngOnInit() {
    this.loadContact();
    this.functionMain.vmsPreferences().then((value) => {
      console.log(value)
      this.project_id = value.project_id
      this.project_config = value.config
    })
  }

  private routerSubscription!: Subscription;
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  onBack() {
    if (this.isAdd) {
      this.toggleShowEdit()
    } else {
      if (this.isMain) {
        this.router.navigate(['/client-main-app'], {queryParams: {reload: true}})
      } else {
        this.isSetting = false
        this.isAdd = false
        this.isEdit = false
        setTimeout(() => {
          this.isMain = true
        }, 300)
      }
    }
    
  }
  
  isMain = true

  contactList: any = []

  groupContact() {

  }

  faPhone = faPhone
  faSetting = faGear

  isAllContacts = true
  isMyContacts = false

  checkBoxChange(is_all: boolean) {
    if (is_all) {
      this.isAllContacts = true
      this.isMyContacts = false
    } else {
      this.isAllContacts = false
      this.isMyContacts = true
    }
  }

  isAdd = false
  isEdit = true

  toggleShowAdd() {
    this.loadProjectId();
    this.isCurrentEdit = false
    this.isEdit = false
    this.resetForm()
    setTimeout(() => {
      this.isAdd = true
    }, 300)
    
  }

  toggleShowEdit() {
    this.isAdd = false
    setTimeout(() => {
      this.isEdit = true
    }, 300)
  }

  contactForm = {
    image: '',
    name: '',
    is_add: false,
    can_call_with: '',
    for_what_user: '',
    related_account: 0,
    contact_number: '',
    is_whatsapp: false,
    id: 0
  }

  resetForm() {
    this.is_show_code = false
    this.contactForm = {
      name: '',
      contact_number: '',
      is_add: false,
      can_call_with: '',
      for_what_user: '',
      related_account: 0,
      is_whatsapp: false,
      image: '',
      id: 0
    }
  }

  onChangeOfCanCallWith(event: any) {
    let value = event.target.value;
    this.contactForm.can_call_with = value;
    console.log(this.contactForm);
  }

  onChangeOfForWhatUser(event: any) {
    let value = event.target.value;
    this.contactForm.for_what_user = value;
    console.log(this.contactForm);
  }

  async loadProjectId() {
    await this.functionMain.vmsPreferences().then((value) => {
      console.log(value)
      this.project_id = value.project_id
      this.loadHost();
    })
  }

  Host: any[] = [];
  contactHost = '';
  project_id = 0;
  project_config: any = {}
  loadHost() {
    this.contactHost = ''
    this.clientMainService.getApi({ project_id: this.project_id }, '/industrial/get/family').subscribe((value: any) => {
      this.Host = value.result.result.map((item: any) => ({ id: item.id, name: item.host_name }));
      if (this.contactForm.for_what_user) {
        this.contactHost = this.contactForm.for_what_user
      }
    })
  }

  onHostChange(event: any) {
    this.contactForm.related_account = event[0]
  }

  onSubmit() {
    console.log(this.contactForm)
    let errMsg = ''
    if (!this.contactForm.name) {
      errMsg += 'Contact name is required! \n'
    }
    if (this.contactForm.contact_number) {
      if (this.contactForm.contact_number.length <= 2 ) {
        errMsg += 'Contact number is required! \n'
      }
    }
    if (errMsg) {
      this.functionMain.presentToast(errMsg, 'danger')
      return
    }
    let url = this.contactForm.id != 0 ? '/client/post/edit_contact' : '/client/post/new_contact'
    this.clientMainService.getApi(this.contactForm, url).subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code == 200) {
          this.functionMain.presentToast(`${this.contactForm.name} successfully added!`, 'success');
          this.resetForm()
          this.loadContact()
          this.toggleShowEdit()
        } else {
          this.functionMain.presentToast(`An error occurred while updating contact!`, 'danger');
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while updating contact!', 'danger');
        console.error(error);
      }
    });
  }
  
  isCurrentEdit = false
  onEditButton(contact: any) {
    this.loadProjectId();
    this.isCurrentEdit = true
    this.isEdit = false
    this.contactForm = {
      name: contact.name,
      contact_number: contact.mobile_number,
      is_add: contact.is_add,
      can_call_with: contact.can_call_with,
      for_what_user: contact.for_what_user,
      related_account: 0,
      image: contact.image,
      id: contact.id,
      is_whatsapp: contact.is_whatsapp,
    }
    console.log('this.contactForm', this.contactForm);
    
    setTimeout(() => {
      this.isAdd = true
      this.contactForm.related_account = contact.related_account
    }, 300)
  }

  isSetting = false
  onSetting() {
    this.isMain = false
    setTimeout(() => {
      this.isSetting = true
      this.isEdit = true
    }, 300)
  }

  isModalDetailPhone = false;
  dataSelect = {
    image: '',
    name: '',
    is_add: false,
    can_call_with: '',
    for_what_user: '',
    related_account: 0,
    contact_number: '',
    is_whatsapp: false,
    id: 0
  }

  pushedModalState = false
  onClickCallButton(contact: any) {
    if (contact.can_call_with === 'phone_dial') {
      if (contact.is_whatsapp) {
        this.dataSelect = {
          name: contact.name,
          contact_number: contact.mobile_number,
          is_add: contact.is_add,
          can_call_with: contact.can_call_with,
          for_what_user: contact.for_what_user,
          related_account: contact.related_account,
          image: contact.image,
          id: contact.id,
          is_whatsapp: contact.is_whatsapp,
        }
        this.isModalDetailPhone = true
        console.log("data select for phone dial is whatsapp true", this.dataSelect);
      } else {
        this.actionToPhoneDial(contact.mobile_number)
      }
    } else if (contact.can_call_with === 'in_app_call') {
      if (contact.for_what_user === 'vms') {
        this.actionToInAppCall(`Project-${this.project_id}`)
      } else if ( contact.for_what_user === 'client_or_end_user') {
        this.actionToInAppCall(contact.related_account)
      }
    } else if (contact.can_call_with === 'both') {
      this.dataSelect = {
        name: contact.name,
        contact_number: contact.mobile_number,
        is_add: contact.is_add,
        can_call_with: contact.can_call_with,
        for_what_user: contact.for_what_user,
        related_account: contact.related_account,
        image: contact.image,
        id: contact.id,
        is_whatsapp: contact.is_whatsapp,
      }
      this.isModalDetailPhone = true
      console.log("data select for both (in app call and phone dial true", this.dataSelect);
    }
    if (this.isModalDetailPhone) {
        this.layerBack()
    }
  }

  actionToPhoneDial(phoneNumber: any) {
    if (this.isModalDetailPhone === true) {
      this.closeModal();
    }
    // this.functionMain.callFromPhone(phoneNumber)
    window.open(`tel:${phoneNumber}`, '_system');
  }

  actionOpenWhatsapp(phoneNumber: any) {
    if (this.isModalDetailPhone === true) {
      this.closeModal();
    }
    const message = encodeURIComponent("Hello!");
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(url, "_blank");
  }

  async actionToInAppCall(id: any) {
    if (this.isModalDetailPhone === true) {
      this.closeModal();
    }
    if (typeof id === 'string') {
      await this.webRtcService.createOffer(false, id, false, true);
    } else if (typeof id === 'number') {
      await this.webRtcService.createOffer(false, id, false, false);
    }
  }

  sortContact: any = []
  isLoading = false
  async loadContact() {
    this.isLoading = true
    this.contactList = []
    this.sortContact = []
    this.clientMainService.getApi({}, '/client/get/contact_list').subscribe({
      next: (results) => {
        this.isLoading = false
        // console.log(results)
        if (results.result.response_code == 200) {
          if (results.result.response_result.length > 0){
            this.contactList = results.result.response_result
            this.sortContact = Array.from(
              new Set(this.contactList.map((record: any) => record.name != "" ? record.name.charAt(0) : false))
            ).map((name) => ({
              name: name,
              date: new Date(),
              schedule_date: '',
              data: this.contactList.filter((item: any) => item.name.charAt(0) == name),            
            }));;
            // console.log(this.sortContact)
          } else {
          }
          // this.functionMain.presentToast(`Success!`, 'success');
        } else {
          this.functionMain.presentToast(`Failed!`, 'danger');
        }
      },
      error: (error) => {
        this.isLoading = false
        this.functionMain.presentToast('Failed!', 'danger');
        console.error(error);
      }
    });
  }

  @ViewChild('fileInput') fileInput!: ElementRef;
  onImageClick() {
    this.fileInput?.nativeElement.click();
  }

  showImage = ''

  selectedFile: File | null = null
  onFileChange(event: any) {
    console.log(event.target.files)
    const file = event.target.files[0];
    try {
      if (file) {
        this.selectedFile = file;
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const base64 = e.target.result.split(',')[1] || e.target.result;
          this.contactForm.image = base64;
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      this.functionMain.presentToast('An error occurred while trying to update the contact image, please try uploading a different image!')
    }
  }

  async onDeleteClick(contact: any) {
    const alertButtons = await this.alertController.create({
      cssClass: 'custom-alert-class-resident-visitors-page',
      header: `Are you sure you want to delete ${contact.name} from your contact?`,
      buttons: [
        {
          text: 'Confirm',
          cssClass: 'confirm-button',
          handler: () => {
            this.deleteContact(contact)
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

  deleteContact(contact: any){
    console.log(contact.id)
    this.clientMainService.getApi({id: contact.id}, '/client/post/delete_contact').subscribe({
      next: (results) => {
        console.log(results)
        if (results.result.response_code == 200) {
          this.functionMain.presentToast(`Successfully delete ${contact.name} from your  contact list!`, 'success');
          this.loadContact()
        } else {
          this.functionMain.presentToast(`An error occurred while deleting contact!`, 'danger');
        }
      },
      error: (error) => {
        this.functionMain.presentToast('An error occurred while deleting contact!', 'danger');
        console.error(error);
      }
    });
  }

  onCall(contact: any) {
    console.log(contact)
  }

  handleRefresh(event: any) {
    this.loadContact().then(() => event.target.complete())
  }

  layerBack() {
    if (!this.pushedModalState) {
      history.pushState(null, '', location.href);
      this.pushedModalState = true;
    }
  
    const closeModalOnBack = () => {
      this.pushedModalState = false
      this.isModalDetailPhone = false
      window.removeEventListener('popstate', closeModalOnBack);
    };
    window.addEventListener('popstate', closeModalOnBack);
  }

  closeModal() {
    this.isModalDetailPhone = false
    if (this.pushedModalState) {
      this.pushedModalState = false;
      history.back(); // simulate the back button
    }
  
  }

  is_show_code = false

}
