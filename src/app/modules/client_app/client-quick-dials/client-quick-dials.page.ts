import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { faGear, faPhone } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { trigger, style, animate, transition } from '@angular/animations';
import { ClientMainService } from 'src/app/service/client-app/client-main.service';
import { FunctionMainService } from 'src/app/service/function/function-main.service';
import { AlertController } from '@ionic/angular';

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

  constructor(private router: Router, private clientMainService: ClientMainService, public functionMain: FunctionMainService, private alertController: AlertController) { }

  ngOnInit() {
    this.loadContact()
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
        this.router.navigate(['/client-main-app'])
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
    name: '',
    contact_number: '',
    is_add: false,
    image: '',
    id: 0
  }

  resetForm() {
    this.contactForm = {
      name: '',
      contact_number: '',
      is_add: false,
      image: '',
      id: 0
    }
  }

  onSubmit() {
    console.log(this.contactForm)
    let errMsg = ''
    if (!this.contactForm.name) {
      errMsg += 'Contact name is required! \n'
    }
    if (this.contactForm.contact_number.length <= 2 ) {
      errMsg += 'Contact number is required! \n'
    }
    if (errMsg) {
      this.functionMain.presentToast(errMsg, 'danger')
      return
    }
    let url = this.contactForm.id != 0 ? '/client/update/edit_contact' : '/client/post/new_contact'
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
    this.isCurrentEdit = true
    this.isEdit = false
    this.contactForm = {
      name: contact.name,
      contact_number: contact.contact_number,
      is_add: contact.is_allow_resident_quick_dials,
      image: contact.image_profile,
      id: contact.id
    }
    setTimeout(() => {
      this.isAdd = true
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

  sortContact: any = []
  isLoading = false
  loadContact() {
    this.isLoading = true
    this.clientMainService.getApi({}, '/client/get/contact_list').subscribe({
      next: (results) => {
        this.isLoading = false
        console.log(results)
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
            console.log(this.sortContact)
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
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64 = e.target.result.split(',')[1] || e.target.result;
        this.contactForm.image = base64;
      };
      reader.readAsDataURL(file);
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
    this.clientMainService.getApi({id: contact.id}, '/client/update/delete_contact').subscribe({
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
}
