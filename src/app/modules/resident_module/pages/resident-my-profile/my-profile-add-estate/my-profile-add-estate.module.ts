import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyProfileAddEstatePageRoutingModule } from './my-profile-add-estate-routing.module';

import { MyProfileAddEstatePage } from './my-profile-add-estate.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyProfileAddEstatePageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [MyProfileAddEstatePage]
})
export class MyProfileAddEstatePageModule {}
