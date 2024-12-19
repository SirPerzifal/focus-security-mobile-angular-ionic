import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResidentCarWarningClampPageRoutingModule } from './resident-car-warning-clamp-routing.module';

import { ResidentCarWarningClampPage } from './resident-car-warning-clamp.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResidentCarWarningClampPageRoutingModule
  ],
  declarations: [ResidentCarWarningClampPage]
})
export class ResidentCarWarningClampPageModule {}
