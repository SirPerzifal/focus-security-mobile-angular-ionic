import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientChangePasswordPageRoutingModule } from './client-change-password-routing.module';

import { ClientChangePasswordPage } from './client-change-password.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientChangePasswordPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [ClientChangePasswordPage]
})
export class ClientChangePasswordPageModule {}
