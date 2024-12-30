import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyProfileMyPetsPageRoutingModule } from './my-profile-my-pets-routing.module';

import { MyProfileMyPetsPage } from './my-profile-my-pets.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyProfileMyPetsPageRoutingModule
  ],
  declarations: [MyProfileMyPetsPage]
})
export class MyProfileMyPetsPageModule {}
