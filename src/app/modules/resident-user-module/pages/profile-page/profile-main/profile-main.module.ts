import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileMainPageRoutingModule } from './profile-main-routing.module';

import { ProfileMainPage } from './profile-main.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileMainPageRoutingModule,
    SharedModule
  ],
  declarations: [ProfileMainPage]
})
export class ProfileMainPageModule {}
