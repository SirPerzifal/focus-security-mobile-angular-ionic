import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResidentHomepagePageRoutingModule } from './resident-homepage-routing.module';

import { ResidentHomepagePage } from './resident-homepage.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResidentHomepagePageRoutingModule,
    SharedModule
  ],
  declarations: [ResidentHomepagePage]
})
export class ResidentHomepagePageModule {}
