import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormForRequestMoveInOutPermitPageRoutingModule } from './form-for-request-move-in-out-permit-routing.module';

import { FormForRequestMoveInOutPermitPage } from './form-for-request-move-in-out-permit.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormForRequestMoveInOutPermitPageRoutingModule,
    SharedModule
  ],
  declarations: [FormForRequestMoveInOutPermitPage]
})
export class FormForRequestMoveInOutPermitPageModule {}
