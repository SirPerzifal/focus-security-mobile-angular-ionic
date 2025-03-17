import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VisitorMainPageRoutingModule } from './visitor-main-routing.module';

import { VisitorMainPage } from './visitor-main.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VisitorMainPageRoutingModule,
    SharedModule
  ],
  declarations: [VisitorMainPage]
})
export class VisitorMainPageModule {}
