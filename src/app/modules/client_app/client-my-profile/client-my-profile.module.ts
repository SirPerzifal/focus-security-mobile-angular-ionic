import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientMyProfilePageRoutingModule } from './client-my-profile-routing.module';

import { ClientMyProfilePage } from './client-my-profile.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientMyProfilePageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [ClientMyProfilePage]
})
export class ClientMyProfilePageModule {}
