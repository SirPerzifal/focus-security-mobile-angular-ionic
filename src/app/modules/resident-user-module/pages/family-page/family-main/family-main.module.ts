import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FamilyMainPageRoutingModule } from './family-main-routing.module';

import { FamilyMainPage } from './family-main.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FamilyMainPageRoutingModule,
    SharedModule
  ],
  declarations: [FamilyMainPage]
})
export class FamilyMainPageModule {}
