import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResidentHomepagePageRoutingModule } from './resident-homepage-routing.module';

import { ResidentHomepagePage } from './resident-homepage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResidentHomepagePageRoutingModule
  ],
  declarations: [ResidentHomepagePage]
})
export class ResidentHomepagePageModule {}
