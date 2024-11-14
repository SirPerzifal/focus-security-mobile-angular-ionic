import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InviteFormPageRoutingModule } from './invite-form-routing.module';

import { InviteFormPage } from './invite-form.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InviteFormPageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [InviteFormPage]
})
export class InviteFormPageModule {}
