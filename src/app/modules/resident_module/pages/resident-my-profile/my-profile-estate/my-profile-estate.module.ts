import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyProfileEstatePageRoutingModule } from './my-profile-estate-routing.module';

import { MyProfileEstatePage } from './my-profile-estate.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyProfileEstatePageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [MyProfileEstatePage]
})
export class MyProfileEstatePageModule {}
