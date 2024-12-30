import { ComponentFactory, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResidentMyProfilePageRoutingModule } from './resident-my-profile-routing.module';

import { ResidentMyProfilePage } from './resident-my-profile.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResidentMyProfilePageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [ResidentMyProfilePage]
})
export class ResidentMyProfilePageModule {}
