import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RaiseARequestService } from 'src/app/service/resident/raise-a-request/raise-a-request.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { faEraser, faPenFancy } from '@fortawesome/free-solid-svg-icons';
import { FamilyService } from 'src/app/service/resident/family/family.service';
import { SignaturePadComponent } from 'src/app/shared/components/signature-pad/signature-pad.component';

@Component({
  selector: 'app-renovation-permit',
  templateUrl: './renovation-permit.page.html',
  styleUrls: ['./renovation-permit.page.scss'],
})
export class RenovationPermitPage implements OnInit {
  @ViewChild('renovationSignContainer') renovationSignComponent!: SignaturePadComponent;

  faPenFancy = faPenFancy
  faEraser = faEraser
  renovationForm: FormGroup;
  agreementChecked: boolean = false; // Status checkbox
  extend_mb = true
  unitId: number = 1; // Replace with actual unit ID
  isModalOpen: boolean = false; // Status modal
  dateNow = new Date().toISOString().slice(0, 10);
  contactPerson: string = '';
  expectedFamilyMember = [
    { id: 0, type: '', hard_type: '' ,name: '', mobile: '', nickname: '', email: '', head_type: '', status: '', tenancy_agreement: '', end_date: new Date() }
  ];
  renovationSigned: string = '';
  isRenovationSigned = false

  constructor(private familyService: FamilyService, private fb: FormBuilder, private renovationService: RaiseARequestService, private toastController: ToastController, private route: Router) {
    this.renovationForm = this.fb.group({
      requestorId: [36],
      name_of_resident: ['KingsMan Condominium'],
      phone_number: ['085830122464'],
      renovation_date: ['', Validators.required],
      renovation_time: ['', Validators.required],
      partner_name: ['Veknesh'],
      renovation_type: ['renovation'],
      block: [1],
      unit: [1],
      contact_person_id: [0],
      renovation_signature: [''],
    });
  }

  showTimeInfo() {
    this.isModalOpen = true; // Membuka modal
  }

  onRenovationSign(event: any) {
    this.renovationSigned = event
    this.renovationForm.value.renovation_signature = event.split(',')[1]
  }

  onContactPersonChange(option: string) {
    this.contactPerson = option;
    this.renovationForm.value.contact_person_id = 1;
  }

  ngOnInit() {
    console.log('tes')
    this.loadExpectedFamily();
  }

  loadCards() {
    this.renovationService.getCardFamilyMember(this.unitId).subscribe(
      (response) => {
        if (response) {
          this.renovationForm.value.requestorId = response.result.family_data[0].id;
        } else {
          this.presentToast('Failed to load card data', 'danger');
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  loadExpectedFamily() {
    this.expectedFamilyMember.pop()
    this.familyService.getFamilyList().subscribe(
      res => {
        var result = res.result['response_result']
        console.log(result)
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
            tenancy_agreement: item['tenancy_aggrement'] });
        });
        this.renovationForm.value.contact_person_id = result[0].id;
      },
      error => {
        console.log(error)
      }
    )
  }

  onClear() {
    this.renovationSigned = ''
    this.renovationSignComponent.clear();
  }

  onSelect(select: any) {
    console.log('Selected:', select);
    this.renovationForm.value.contact_person_id = select['id'];
  }

  onSubmit() {
    if (this.renovationForm.valid) {
      if (!this.renovationForm.value.renovation_signature) {
        this.presentToast('Please provide your sign.', 'danger');
        return
      }
      console.log(this.renovationForm.value);

      // Gabungkan renovation_date dan renovation_time
      const renovationDate = this.renovationForm.value.renovation_date;
      const renovationTime = this.renovationForm.value.renovation_time;

      // Format menjadi string ISO
      const formattedDateTime = new Date(`${renovationDate}T${renovationTime}`);

      // Panggil service untuk mengirim data
      this.renovationService.postSchedule(
        formattedDateTime.toISOString(),
        this.renovationForm.value.requestorId,
        this.renovationForm.value.renovation_type,
        this.renovationForm.value.block,
        this.renovationForm.value.unit,
        this.renovationForm.value.contact_person_id,
        this.renovationForm.value.renovation_signature,
        '',
        '',
        '',
        '',
      ).subscribe({
        next: (response) => {
          if (response.result.response_code === 400) {
            console.log(this.renovationForm);
            this.presentToast('Theres something wrong when submit your form!', 'danger');
          } else {
            console.log('Response:', response);
            this.OnDestroy();
            this.presentToast('Request submitted successfully!', 'success');
            this.route.navigate(['resident-raise-a-request'])
          }
        },
        error: (error) => {
          console.error('Error:', error);
          this.presentToast('Failed to submit request.', 'danger');
        }
      });
    } else {
      console.log('Form is invalid');
      this.presentToast('Form is invalid. Please fill all required fields.', 'danger');
    }
  }

  navigateToEditFamily(family: any) {
    console.log(family)
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
