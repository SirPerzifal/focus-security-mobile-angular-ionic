import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyProfileMyPetsPageRoutingModule } from './my-profile-my-pets-routing.module';

import { MyProfileMyPetsPage } from './my-profile-my-pets.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyProfileMyPetsPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [MyProfileMyPetsPage]
})
export class MyProfileMyPetsPageModule {}
