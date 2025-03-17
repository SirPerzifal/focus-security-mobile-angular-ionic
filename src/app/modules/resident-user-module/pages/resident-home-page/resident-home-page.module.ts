import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResidentHomePagePageRoutingModule } from './resident-home-page-routing.module';

import { ResidentHomePagePage } from './resident-home-page.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResidentHomePagePageRoutingModule,
    SharedModule
  ],
  declarations: [ResidentHomePagePage]
})
export class ResidentHomePagePageModule {}
