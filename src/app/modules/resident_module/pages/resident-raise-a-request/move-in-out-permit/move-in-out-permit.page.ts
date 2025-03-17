import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RaiseARequestService } from 'src/app/service/resident/raise-a-request/raise-a-request.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FamilyService } from 'src/app/service/resident/family/family.service';
import { Subscription } from 'rxjs';
import { GetUserInfoService } from 'src/app/service/global/get-user-info/get-user-info.service';
import { ModalController } from '@ionic/angular';
import { TermsConditionModalComponent } from 'src/app/shared/resident-components/terms-condition-modal/terms-condition-modal.component';
import { AuthService } from 'src/app/service/resident/authenticate/authenticate.service';

@Component({
  selector: 'app-move-in-out-permit',
  templateUrl: './move-in-out-permit.page.html',
  styleUrls: ['./move-in-out-permit.page.scss'],
})
export class MoveInOutPermitPage implements OnInit {

  moveInOutForm: FormGroup;
  agreementChecked: boolean = false; // Status checkbox
  isModalOpen: boolean = false; // Status modal
  dateNow = new Date().toISOString().slice(0, 10);
  userName: string = '';
  condoName: string = '';
  unit: number = 1; // Replace with actual unit ID
  unitId: number = 1; // Replace with actual unit ID
  block: number = 1; // Replace with actual block ID
  noTel: string = '';
  extend_mb = false
  contactPerson: string = '';
  expectedFamilyMember: any = [];
  moveType: string = '';

  constructor(private modalController: ModalController, private familyService: FamilyService, private fb: FormBuilder, private moveInOutService: RaiseARequestService, private toastController: ToastController, private route: Router, private getUserInfoService: GetUserInfoService, private authService:AuthService) {
    this.moveInOutForm = this.fb.group({
      requestorId: [15],
      name_of_resident: ['KingsMan Condominium'],
      phone_number: ['085830122464'],
      move_date: ['', Validators.required],
      move_time: ['', Validators.required],
      partner_name: ['Veknesh'],
      move_type: ['', Validators.required],
      block: [0],
      unit: [0],
      contact_person_id: [1],
      contractor_contact_person: [''], 
      contractor_contact_number: [''],
      contractor_company_name: [''],
      contractor_vehicle_number: ['']
    });
  }
  
  termsAndCOndition: string = '';

  async presentModalAgreement() {
    // console.log("tes");
        // // console.log(email);
    // // console.log('presentModalpresentModalpresentModalpresentModalpresentModal');
    
    const modal = await this.modalController.create({
      component: TermsConditionModalComponent,
      cssClass: 'terms-condition-modal',
      componentProps: {
        // email: email
        terms_condition: this.termsAndCOndition
      }
  
    });

    modal.onDidDismiss().then((result) => {
      if (result) {

      }
    });

    return await modal.present();
  }
  onChangeTypeMove(type: string) {
    this.extend_mb = true
    if (type !== 'bulky_item') {
      this.moveInOutForm.get('move_type')!.setValue(type); // Then set the new move type
      this.moveInOutForm.value.contact_person_id = [1];
      this.agreementChecked = false;
      this.moveType = type;
    } else {
      this.moveInOutForm = this.fb.group({
        requestorId: [0],
        name_of_resident: [''],
        phone_number: ['085830122464'],
        move_date: ['', Validators.required],
        move_time: ['', Validators.required],
        partner_name: ['Veknesh'],
        move_type: ['', Validators.required],
        block: [0],
        unit: [0],
        contractor_contact_person: [''], 
        contractor_contact_number: [''],
        contractor_company_name: [''],
        contractor_vehicle_number: ['']
      });
      this.moveInOutForm.get('move_type')!.setValue(type); // Then set the new move type
      this.moveType = type;
      this.agreementChecked = false;
    }
  }

  showTimeInfo() {
    this.isModalOpen = true; // Membuka modal
  }

  onContactPersonChange(option: string) {
    this.contactPerson = option;
    if (option === 'same_as_above') {
      this.moveInOutForm.value.contact_person_id = 1;
    }
  }

  ngOnInit() {
    // Ambil data unit yang sedang aktif
    this.getUserInfoService.getPreferenceStorage(
      [ 
        'user',
        'unit',
        'block_name',
        'block',
        'unit_name',
        'project_name'
      ]
    ).then((value) => {
      const parse_user = this.authService.parseJWTParams(value.user);
      // // console.log(value);
      this.block = value.block_name;
      this.moveInOutForm.get('block')!.setValue(Number(value.block))
      this.unitId = Number(value.unit);
      this.moveInOutForm.get('unit')!.setValue(Number(value.unit))
      this.unit = value.unit_name;
      this.condoName = value.project_name;
      this.userName = parse_user.name
      // // console.log('unit', this.unitId);
      this.loadExpectedFamily();
    })
  }

  loadExpectedFamily() {
    this.familyService.getFamilyList(this.unitId).subscribe((response) => {
      var result = response.result['response_result']
      result.forEach((item: any) => {
        this.expectedFamilyMember.push({
          id: item['family_id'], 
          type: item['member_type'], 
          hard_type: item['member_hard_type'], 
          name: item['family_full_name'], 
          mobile: item['family_mobile_number'], 
          nickname: item['family_nickname'], 
          email: item['family_email'], 
          head_type: item['member_hard_type'] == 'tenants' ? 'Tenants' : 'Family',
          end_date: item['end_of_tenancy_aggrement'],
          status: item['states'],
          tenancy_agreement: item['tenancy_aggrement'],
          family_photo: item['family_photo']
        });
      });
    });
  }

  onSelect(select: any) {
    // console.log('Selected:', select);
    this.moveInOutForm.value.contact_person_id = select['id'];
  }

  onSubmit() {
    if (this.moveInOutForm.valid) {
      if (this.moveInOutForm.value.move_type !== 'bulky_item') {
        if (!this.moveInOutForm.value.contractor_contact_person) {
          this.presentToast('Please fill contact person contractor fields.', 'danger');
          return
        } 
        if (!this.moveInOutForm.value.contractor_contact_number) {
          this.presentToast('Please fill contact number contractor fields.', 'danger');
          return
        }
        if (!this.moveInOutForm.value.contractor_company_name) {
          this.presentToast('Please fill company name contractor fields.', 'danger');
          return
        }
        if (!this.moveInOutForm.value.contractor_vehicle_number) {
          this.presentToast('Please fill vehicle number contractor fields.', 'danger');
          return
        }
      }
      // console.log(this.moveInOutForm.value);

      // Gabungkan move_date dan move_time
      const moveDate = this.moveInOutForm.value.move_date;
      const moveTime = this.moveInOutForm.value.move_time;

      // Format menjadi string ISO
      const formattedDateTime = new Date(`${moveDate}T${moveTime}`);

      // Panggil service untuk mengirim data
      this.moveInOutService.postSchedule(
        formattedDateTime.toISOString(),
        this.moveInOutForm.value.requestorId,
        this.moveInOutForm.value.move_type,
        this.moveInOutForm.value.block,
        this.moveInOutForm.value.unit,
        this.moveInOutForm.value.contact_person_id,
        '',
        this.moveInOutForm.value.contractor_contact_person,
        this.moveInOutForm.value.contractor_contact_number,
        this.moveInOutForm.value.contractor_company_name,
        this.moveInOutForm.value.contractor_vehicle_number
      ).subscribe({
        next: (response) => {
          // console.log('Response:', response);
          this.presentToast('Request submitted successfully!', 'success');
          this.route.navigate(['resident-raise-a-request']);
          this.OnDestroy();
        },
        error: (error) => {
          console.error('Error:', error);
          this.presentToast('Failed to submit request.', 'danger');
        }
      });
    } else {
      // console.log('Form is invalid');
      this.presentToast('Form is invalid. Please fill all required fields.', 'danger');
    }
  }

  navigateToEditFamily(family: any) {
    // console.log(family)
    this.route.navigate(['/family-edit-member'], {
      state: {
        id: family.id,
        type: family.type,
        hard_type: family.hard_type,
        name: family.name,
        mobile: family.mobile,
        head_type: family.head_type,
        nickname: family.nickname,
        email: family.email,
        end_date: family.end_date,
        tenant: family.tenant,
        warning: family.warning,
        status: family.status, // Tambahkan ini jika perlu
      }
    });
  }

  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color
    });
    toast.present();
  }

  private routerSubscription!: Subscription;
  OnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  onCheck(focus: any) {
    this.extend_mb = focus
    this.agreementChecked = true;
    if (this.agreementChecked = true) {
      this.agreementChecked = false;
    }
  }
}
