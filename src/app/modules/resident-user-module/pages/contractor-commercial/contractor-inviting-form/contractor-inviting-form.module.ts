import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContractorInvitingFormPageRoutingModule } from './contractor-inviting-form-routing.module';

import { ContractorInvitingFormPage } from './contractor-inviting-form.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContractorInvitingFormPageRoutingModule,
    SharedModule
  ],
  declarations: [ContractorInvitingFormPage]
})
export class ContractorInvitingFormPageModule {}
