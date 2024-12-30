import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyProfileEstatePageRoutingModule } from './my-profile-estate-routing.module';

import { MyProfileEstatePage } from './my-profile-estate.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyProfileEstatePageRoutingModule
  ],
  declarations: [MyProfileEstatePage]
})
export class MyProfileEstatePageModule {}
