import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FamilyMainPageRoutingModule } from './family-main-routing.module';

import { FamilyMainPage } from './family-main.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FamilyMainPageRoutingModule
  ],
  declarations: [FamilyMainPage]
})
export class FamilyMainPageModule {}
