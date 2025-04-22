import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PetsDetailForProfilePageRoutingModule } from './pets-detail-for-profile-routing.module';

import { PetsDetailForProfilePage } from './pets-detail-for-profile.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PetsDetailForProfilePageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [PetsDetailForProfilePage]
})
export class PetsDetailForProfilePageModule {}
